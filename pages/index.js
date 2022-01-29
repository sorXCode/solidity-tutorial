import { useEffect, useState } from "react";
import PrimaryButton from "../components/primary-button";
import abi from "../utils/Keyboards.json";
import { ethers } from "ethers";
import Keyboard from "../components/keyboard"

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState("");
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contractAddress = "0x188a53CE8CB161bbD653bf67d195307A5317a6e7"
  const contractABI = abi.abi

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("We have an authorized account: ", account);
      setConnectedAccount(account);
    } else {
      console.log("No Account was authorized");
    }
  }

  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }
    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      handleAccounts(accounts)
    }
  }

  useEffect(() => getConnectedAccount());

  const connectAccount = async () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    handleAccounts(accounts);
  }

  const getKeyboardContract = () => {

  }
  const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
        const keyboards = await keyboardsContract.getKeyboards();

        setKeyboards(keyboards);
        console.log('Retrieved keyboards: ', keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  }

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!ethereum) {
      console.error("Ethereum object is required to create a keyboard");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);

    const createTxn = await keyboardsContract.create(newKeyboard);
    console.log('Creating transaction for new keyboard ', createTxn.hash);

    await createTxn.wait();
    console.log('Created Keyboard ', createTxn.hash);

    getKeyboards();

  }

  useEffect(() => getKeyboards(), [connectedAccount])



  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }
  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div><p>Connected to: {connectedAccount}</p></div>
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {console.log("KEYBOARDS=>", keyboards)}
        
          {keyboards.map(
            ([kind, isPBT, filter], i) => (
              <Keyboard key={i} kind={kind} isPBT={isPBT} filter={filter} />
            )
          )}
        </div>
      </div>
    )
  }

  if (keyboardsLoading){
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>Loading Keyboards...</p>
    </div>
  }

  // No keyboards yet
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  )

}