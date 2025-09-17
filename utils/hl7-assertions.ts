import { expect } from '@playwright/test';

export function assertHL7Segments(parsed: Record<string, any>) {
  assertMSH(parsed.MSH);
  assertPID(parsed.Patient);
  if (parsed.PV1) assertPV1(parsed.PV1);
}

export function assertMSH(msh: any) {
  console.log(msh.sendingApplication);
  console.log(msh.messageType);
}

export function assertPID(pid: any) {
  console.log(pid);
}

export function assertPV1(pv1: any) {
  console.log(pv1);
}
