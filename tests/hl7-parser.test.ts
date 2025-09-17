import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { parseHL7toReadableJSON } from '../utils/hl7-utils';
import * as HL7Assertions from '../utils/hl7-assertions';

test.describe('HL7 Message Parsing & Validation', () => {
  let hl7Message: string;
  let parsedHL7: Record<string, any>;

  test.beforeAll(() => {
    const filePath = path.resolve(__dirname, 'test-data', 'HL7.txt');
    hl7Message = fs.readFileSync(filePath, 'utf8');
    parsedHL7 = parseHL7toReadableJSON(hl7Message);
  });

  test('HL7 segments should be parsed correctly', () => {
    expect(parsedHL7).toBeDefined();
    HL7Assertions.assertMSH(parsedHL7.MSH);
    HL7Assertions.assertPID(parsedHL7.Patient);
    HL7Assertions.assertPV1(parsedHL7.PV1);

  });
});