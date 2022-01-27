async function main() {
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();

    console.log("Keyboards contracts deployed at: ", keyboardsContract.address);

    const txn = await keyboardsContract.create("Keychron D!");
    await txn.wait();

    console.log("We've got keyboards: ", await keyboardsContract.getKeyboards());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })