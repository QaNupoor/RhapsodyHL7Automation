type HL7SegmentParser = (fields: string[], result: Record<string, any>) => void;

const defaultParsers: Record<string, HL7SegmentParser> = {
  MSH: parseMSH,
  PID: parsePID,
  OBX: parseOBX,
  AL1: parseAL1,
  DG1: parseDG1,
  IN1: parseIN1,
  EVN: parseEVN,
  PD1: parsePD1,
  NK1: parseNK1,
  PV1: parsePV1,
  PV2: parsePV2,
};

export function parseHL7toReadableJSON(
  hl7: string,
  parsers: Record<string, HL7SegmentParser> = defaultParsers
): Record<string, any> {
  const segments = hl7.trim().split(/\r\n|\n|\r/);
  const result: Record<string, any> = {};

  for (const segment of segments) {
    const fields = segment.split('|');
    const segmentType = fields[0];
    const parser = parsers[segmentType];
    if (parser) {
      parser(fields, result);
    }
  }

  return result;
}


function parseMSH(fields: string[], result: Record<string, any>) {
  result['MSH'] = {
    sendingApplication: fields[2],
    sendingFacility: fields[3],
    receivingApplication: fields[4],
    receivingFacility: fields[5],
    dateTimeOfMessage: fields[6],
    messageType: fields[8],
    messageControlId: fields[9],
    processingId: fields[10],
    versionId: fields[11],
  };
}

function parsePID(fields: string[], result: Record<string, any>) {
  const nameParts = (fields[5] ?? '').split('^');
  const addressParts = (fields[11] ?? '').split('^');
  result['Patient'] = {
    id: (fields[3] ?? '').split('^')[0] || '',
    name: {
      family: nameParts[0] || '',
      given: nameParts[1] || '',
    },
    birthDate: fields[7] || '',
    gender: fields[8] === 'M' ? 'male' : fields[8] === 'F' ? 'female' : 'unknown',
    address: {
      line: addressParts[0] || '',
      city: addressParts[2] || '',
      state: addressParts[3] || '',
      postalCode: addressParts[4] || '',
    },
    phone: fields[13] || '',
  };
}

function parseOBX(fields: string[], result: Record<string, any>) {
  result['OBX'] = result['OBX'] || [];
  result['OBX'].push({
    setId: fields[1] || '',
    valueType: fields[2] || '',
    observationIdentifier: fields[3] || '',
    observationValue: fields[5] || '',
    units: fields[6] || '',
    observationResultStatus: fields[11] || '',
    dateTimeOfObservation: fields[14] || '',
  });
}

function parseAL1(fields: string[], result: Record<string, any>) {
  result['AL1'] = result['AL1'] || [];
  result['AL1'].push({
    setId: fields[1] || '',
    allergyType: fields[2] || '',
    allergyCodeMnemonicDescription: fields[3] || '',
    allergySeverity: fields[4] || '',
    allergyReaction: fields[5] || '',
  });
}

function parseDG1(fields: string[], result: Record<string, any>) {
  result['DG1'] = result['DG1'] || [];
  result['DG1'].push({
    setId: fields[1] || '',
    diagnosisCodingMethod: fields[2] || '',
    diagnosisCode: fields[3] || '',
    diagnosisDescription: fields[4] || '',
    diagnosisDateTime: fields[5] || '',
    diagnosisType: fields[6] || '',
    diagnosisPriority: fields[15] || '',
  });
}

function parseIN1(fields: string[], result: Record<string, any>) {
  result['IN1'] = result['IN1'] || [];
  result['IN1'].push({
    setId: fields[1] || '',
    insurancePlanId: fields[2] || '',
    insuranceCompanyId: fields[3] || '',
    insuranceCompanyName: fields[4] || '',
    planEffectiveDate: fields[12] || '',
    planExpirationDate: fields[13] || '',
    planType: fields[15] || '',
    nameOfInsured: fields[16] || '',
    insuredsRelationshipToPatient: fields[17] || '',
    releaseInformationCode: fields[27] || '',
    verificationStatus: fields[45] || '',
    coverageType: fields[47] || '',
  });
}

function parseEVN(fields: string[], result: Record<string, any>) {
  result['EVN'] = {
    eventTypeCode: fields[1] || '',
    recordedDateTime: fields[2] || '',
    eventReasonCode: fields[3] || '',
    operatorId: fields[4] || '',
    eventOccurred: fields[5] || '',
    plannedEventDateTime: fields[6] || '',
  };
}

function parsePD1(fields: string[], result: Record<string, any>) {
  result['PD1'] = {
    livingDependency: fields[13] || '',
    livingArrangement: fields[14] || '',
    protectionIndicator: fields[18] || '',
    studentIndicator: fields[19] || '',
    handicap: fields[20] || '',
  };
}

function parseNK1(fields: string[], result: Record<string, any>) {
  const nameParts = fields[2]?.split('^') || [];
  const addressParts = fields[4]?.split('^') || [];
  result['NK1'] = result['NK1'] || [];
  result['NK1'].push({
    name: {
      family: nameParts[0] || '',
      given: nameParts[1] || '',
    },
    relationship: fields[3] || '',
    address: {
      line: addressParts[0] || '',
      city: addressParts[2] || '',
      state: addressParts[3] || '',
      postalCode: addressParts[4] || '',
    },
    phone: fields[5] || '',
  });
}

function parsePV1(fields: string[], result: Record<string, any>) {
  result['PV1'] = {
    patientClass: fields[2] || '',
    assignedPatientLocation: fields[3] || '',
    attendingDoctor: fields[7] || '',
    referringDoctor: fields[8] || '',
    hospitalService: fields[10] || '',
    admitSource: fields[14] || '',
    patientType: fields[18] || '',
    visitNumber: fields[19] || '',
    admitDateTime: fields[44] || '',
  };
}

function parsePV2(fields: string[], result: Record<string, any>) {
  result['PV2'] = {
    priorPendingLocation: fields[1] || '',
    admitReason: fields[3] || '',
    patientValuables: fields[5] || '',
    expectedAdmitDateTime: fields[8] || '',
    expectedDischargeDateTime: fields[9] || '',
    visitDescription: fields[12] || '',
    clinicOrganizationName: fields[23] || '',
    patientStatusCode: fields[24] || '',
    visitPriorityCode: fields[25] || '',
    expectedSurgeryDateTime: fields[33] || '',
    newbornBabyIndicator: fields[36] || '',
  };
}
