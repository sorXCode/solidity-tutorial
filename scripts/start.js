async function main() {
    async function getKeyboards(){
        const keyboards = await keyboardsContract.getKeyboards();
        console.log("We've got keyboards: ", keyboards);
    }
    const [owner, participant_a, participant_b, participant_c, participant_d] = await hre.ethers.getSigners();

    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();
    console.log("Contract deployed to: ", keyboardsContract.address);
    await getKeyboards();


    const txn = await keyboardsContract.create("Keychron K7");
    await txn.wait();
    const txn_a = await keyboardsContract.connect(participant_a).create("Keychron Q1");
    await txn_a.wait();
    const txn_b = await keyboardsContract.connect(participant_b).create("Keychron K6");
    await txn_b.wait();
    const txn_c = await keyboardsContract.connect(participant_c).create("Keychron k5 mini");
    await txn_c.wait();
    const txn_d = await keyboardsContract.connect(participant_d).create("Keychron K8");
    await txn_d.wait();

    await getKeyboards();

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })
