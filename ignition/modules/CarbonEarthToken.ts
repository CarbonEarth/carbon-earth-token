import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CarbonEarthTokenModule = buildModule("CarbonEarthTokenModule", (m) => {
  const CarbonEarthToken = m.contract("CarbonEarthToken");
  return { CarbonEarthToken };
});

export default CarbonEarthTokenModule;
