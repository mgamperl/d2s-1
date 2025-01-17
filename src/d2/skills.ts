import * as types from './types';
import { BinaryReader } from '../binary/binaryreader';
import { BinaryWriter } from '../binary/binarywriter';

export async function readSkills(char: types.ID2S, reader: BinaryReader, constants: types.IConstantData) {
  char.skills = [] as types.ISkill[];
  let offset = SkillOffset[<string>char.header.class];
  let header = reader.ReadString(2);                                           //0x0000 [skills header = 0x69, 0x66 "if"]
  if(header !== "if") {
    throw new Error(`Skills header 'if' not found at position ${reader.Position() - 2}`);
  }
  for(let i = 0; i < 30; i++) {
    let id = (offset + i);
    char.skills.push({
      id: id,
      points: reader.ReadUInt8(),
      name: constants.skills[id].s
    } as types.ISkill);
  }
}

export async function writeSkills(char: types.ID2S, constants: types.IConstantData): Promise<Uint8Array> {
  let writer = new BinaryWriter().SetLittleEndian();
  writer.WriteString("if");                                                    //0x0000 [skills header = 0x69, 0x66 "if"]
  //probably array length checking/sorting of skills by id...
  for(let i = 0; i < 30; i++) {
    writer.WriteUInt8(char.skills[i].points);
  }
  return writer.toArray();
}

interface ISkillOffset {
  [key: string]: number;
};

const SkillOffset: ISkillOffset = {
  "Amazon" : 6,
  "Sorceress" : 36,
  "Necromancer" : 66,
  "Paladin" : 96,
  "Barbarian" : 126,
  "Druid" : 221,
  "Assassin" : 251,
};