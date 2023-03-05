### `ELS Description`

ELS (Ethereum Listing Service) is a fully decentralized on-chain listing protocol that operates on the Ethereum blockchain. ELS is designed to be permissionless, decentralized, and operated by a DAO (Decentralized Autonomous Organization).

Through ELS, users can post any type of information on the ELS smart contract, including jobs, product sales, and more. The DAO members are responsible for proposing and finalizing new categories or managing invalid information.

With the use of ERC6150, a B+ tree structure, ELS can maintain a dynamic set of smart contracts that represent various layers of categorization, enabling users to locate the information they need accurately.

As the volume of listing data grows, ELS plans to move the listing data from the L1 smart contract into the Ethereum native storage layer, ethStorage, or IPFS. However, the Categories B+ tree and the DAO will remain on Ethereum Layer1 to ensure decentralization.

### `Installation`

npm install\
npm start\
Open http://localhost:3000/management to view DAO Management page in the brower.\
Open http://localhost:3000/categories to view Category page in the brower.

In DAO Management page, DAO admin is able to add categories.\
In Category page, user can post items in any category. User may click category to check all items in that category.

### `Use Case`
When a user wants to post an item, they could choose which categories they wish to locate their information.  On the other side, another user could search and index their needs quickly. 

In the aspect of storage, the categories will be stored on the Layer 1 blockchain. For the actual instances, they will be stored on ifps or layer 2 storage solution like EthStorage.

### `Summary`
ELS implements ERC6150, a hierarchical B+ tree-like structure, to maintain a dynamic set of smart contracts that represent various layers of categorization. This enables users to accurately locate the information they need easily.

As the volume of listing data grows, ELS plans to move its storage from the L1 smart contract to the Ethereum native storage layer, EthStorage. The categories structure will remain on Ethereum Layer 1 to ensure decentralization.

Moreover, ELS solves the problem of centralization in categorization, which can lead to bias and unfairness in how information is presented and accessed. With ELS, users can easily add new categories or update existing ones through the DAO governance model, making the categorization process more efficient and equitable.

Overall, ELS is an on-chain listing protocol that solves critical challenges of organizing and categorizing information on the blockchain. With its decentralized and community-driven approach, ELS offers a transparent and decentralized platform for listing any data including products, services, and job postings, paying the way for a fairer and more efficient economy.
