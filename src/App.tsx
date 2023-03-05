import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CategorySummaryPage } from "./category-summary-page/category-summary-page";
import { CategoryDetailsPage } from "./category-details-page/category-details-page";
import { useState } from "react";
import { ManagementPage } from "./management-page/management-page";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  const fetchWallet = (): void => {
    // 检测 MetaMask 是否安装
    const globalWin = window as any;
    if (typeof globalWin.ethereum !== "undefined") {
      // 连接到用户的 MetaMask 钱包
      globalWin.ethereum
        .enable()
        .then((accounts: any) => {
          // 获取当前网络 ID
          const networkId = globalWin.ethereum.networkVersion;
          // 获取用户钱包地址
          const address = accounts[0];
          // 在控制台输出信息
          console.log(
            "Connected to MetaMask wallet:",
            address,
            "on network:",
            networkId,
            "accounts: ",
            accounts
          );
          // 现在可以使用 address 和 networkId 进行交互
          // ...
          setWalletAddress(address);
        })
        .catch((e: any) => {
          console.error("User denied account access", e);
          return "";
        });
    } else {
      console.error("MetaMask is not installed");
    }
  };
  return (
    <div className='app'>
      <Routes>
      <Route
          path="/management"
          element={
            <ManagementPage
              fetchWallet={fetchWallet}
              walletAddress={walletAddress}
            />
          }
        />
        <Route
          path="/categories"
          element={
            <CategorySummaryPage
              fetchWallet={fetchWallet}
              walletAddress={walletAddress}
            />
          }
        />
        <Route
          path="/categories/:categoryId"
          element={
            <CategoryDetailsPage
              fetchWallet={fetchWallet}
              walletAddress={walletAddress}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
