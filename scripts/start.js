async function main() {
    async function getKeyboards(){
        const keyboards = await keyboardsContract.getKeyboards();
        console.log("We've got keyboards: ", keyboards);
    }
    async function getBalance(address){
        return await hre.ethers.provider.getBalance(address);
    }

    const [owner, participant_a, participant_b, participant_c, participant_d] = await hre.ethers.getSigners();

    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();
    console.log("Contract deployed to: ", keyboardsContract.address);
    await getKeyboards();


    const txn = await keyboardsContract.create(1, true, "Keychron K7");
    await txn.wait();
    const txn_a = await keyboardsContract.connect(participant_a).create(0, false, "sepia");
    await txn_a.wait();
    // const txn_b = await keyboardsContract.connect(participant_b).create(4, true, "grayscale");
    // await txn_b.wait();
    // const txn_c = await keyboardsContract.connect(participant_c).create(3, true, "invert");
    // await txn_c.wait();
    // const txn_d = await keyboardsContract.connect(participant_d).create(2, false, "hue-rotate-90");
    // await txn_d.wait();

    await getKeyboards();
    
    const balanceBefore = await getBalance(participant_a.address);
    console.log("Balance Before Tipping: ", hre.ethers.utils.formatEther(balanceBefore));
    
    // participant_a being tipped by owner
    const tipAmount = hre.ethers.utils.parseEther("1000");
    const tipTxn = await keyboardsContract.tip(1, {'value': tipAmount});
    const tipTxnReceipt = await tipTxn.wait();
    console.log(tipTxnReceipt.events)
    console.log("Tipped: ", hre.ethers.utils.formatEther(tipAmount));
    const balanceAfter = await getBalance(participant_a.address)
    console.log("Balance After Tipping: ", hre.ethers.utils.formatEther(balanceAfter));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })
