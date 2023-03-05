import { ethers } from "ethers"
console.log(ethers)

const contractAddress = "0x2dc1FefBB0e3E485a25d49b15358544BE6a3B4FB";
const abi = [
    "function addChildNode(address to, uint256 parent, string memory name)"
];

export async function add_category(parent_id: string, name: string) {
    console.log('parent_id: ', parent_id, name);
    const globalWin: any = window;

    if (typeof globalWin.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(globalWin.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const address = await signer.getAddress();
            console.log('address: ', address);

            const transactionResponse = await contract.addChildNode(
                address,
                parent_id,
                name
            )

            await listenForTransactionMine(transactionResponse, provider)
            console.log(`Done Posting`)
        } catch(error) {
            console.log(error)
        }
    }
}



function listenForTransactionMine(transactionResponse: any, provider: any) {
    console.log(`Mining: ${transactionResponse.hash} `)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt:any) => {
            console.log(
                `complete with ${transactionReceipt.confirmations} confirmation `
            )
            resolve(transactionReceipt);
        })
    })
}

