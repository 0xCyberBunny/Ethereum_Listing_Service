import { ethers } from "ethers"
console.log(ethers)

const contractAddress = "0x3E3cDcfd1C5CbF9d08b5ee162155F1Af3A2EB5C9";
const abi = [
    "function post(uint256 category, string memory title, string memory description)"
];

export async function submit(category: string, title: string, description: string) {
    const globalWin: any = window;
    if (typeof globalWin.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(globalWin.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.post(
                category,
                title,
                description
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
