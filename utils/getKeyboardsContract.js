import { ethers } from "ethers";

import abi from "../utils/Keyboards.json"

const contractAddress = '0x4Fe6123E55511BFbda4a085462B12A226a8FD537';
const contractABI = abi.abi;

export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}