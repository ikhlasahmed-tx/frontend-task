import { randomInt } from "node:crypto";
import { IsNull, QueryFailedError } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { hashSecret } from "../utils/hash";
import { HttpError } from "../utils/HttpError";
import { toPublicUser } from "./auth.service";

const userRepository = AppDataSource.getRepository(User);
const walletRepository = AppDataSource.getRepository(Wallet);

const COUNTRY_CODES = new Set(`
  AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ
  BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR
  CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR
  GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU
  ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ
  LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ
  MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF
  PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI
  SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR
  TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW
`.trim().split(/\s+/));

function isCountryCode(code: unknown): code is string {
  return typeof code === "string" && COUNTRY_CODES.has(code);
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function randomAddress() {
  return Array.from({ length: 44 }, () => BASE58[randomInt(BASE58.length)]).join("");
}

function toPublicWallet(wallet: Wallet) {
  return { name: wallet.name, address: wallet.address, balanceUsd: Number(wallet.balance_usd) };
}

export async function getMe(userId: string) {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new HttpError(401, "Not logged in");

  const wallet = await walletRepository.findOne({ where: { user_id: userId } });
  return {
    user: toPublicUser(user),
    wallet: wallet ? toPublicWallet(wallet) : null,
  };
}

export async function updateMe(
  userId: string,
  { citizenship, passcode }: { citizenship?: unknown; passcode?: unknown },
) {
  if (citizenship === undefined && passcode === undefined) throw new HttpError(400, "Nothing to update");

  const fields: Record<string, string> = {};
  if (citizenship !== undefined && !isCountryCode(citizenship)) {
    fields.citizenship = "Choose a valid country";
  }
  if (passcode !== undefined && !(typeof passcode === "string" && /^\d{6}$/.test(passcode))) {
    fields.passcode = "Enter a 6-digit passcode";
  }
  if (Object.keys(fields).length > 0) throw new HttpError(400, "Validation failed", fields);

  if (!(await userRepository.exists({ where: { id: userId } }))) throw new HttpError(401, "Not logged in");

  if (passcode !== undefined) {
    if (!(await walletRepository.exists({ where: { user_id: userId } }))) {
      throw new HttpError(409, "Create your wallet first");
    }
    const { affected } = await userRepository.update(
      { id: userId, passcode_hash: IsNull() },
      { passcode_hash: await hashSecret(passcode as string) },
    );
    if (affected === 0) throw new HttpError(409, "Passcode is already set");
  }

  if (citizenship !== undefined) {
    await userRepository.update({ id: userId }, { citizenship: citizenship as string });
  }

  return getMe(userId);
}

export async function createWallet(userId: string) {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new HttpError(401, "Not logged in");
  if (user.citizenship === null) throw new HttpError(409, "Set your citizenship first");

  const existing = await walletRepository.findOne({ where: { user_id: userId } });
  if (existing) return { wallet: toPublicWallet(existing), created: false };

  try {
    const wallet = await walletRepository.save(walletRepository.create({ user_id: userId, address: randomAddress() }));
    return { wallet: toPublicWallet(wallet), created: true };
  } catch (err) {
    if (err instanceof QueryFailedError && (err.driverError as { code?: string }).code === "23505") {
      const wallet = await walletRepository.findOneOrFail({ where: { user_id: userId } });
      return { wallet: toPublicWallet(wallet), created: false };
    }
    throw err;
  }
}