import { Button, Image, Badge } from "antd";
import { useEffect, useState } from "react";

interface Props {
  fetchWallet: () => void;
  walletAddress: string;
}
export function UserAvatar({ fetchWallet, walletAddress }: Props) {
  const [buttonText, setButtonText] = useState("Connect Wallet");

  const handleWalletButtonClick = () => {
    fetchWallet();
  };

  useEffect(() => {
    if (walletAddress.length > 0) {
      setButtonText(walletAddress);
    }
  }, [walletAddress]);

  return (
    <>
      <div className="userAvatarHeader">
        <Image
          className="userAvatarIcon"
          width={150}
          src={"../../assets/ELS_1.svg"}
        />
        <div className="userAvatarTitle">
          <span className="userAvatarHighlightTitle">E</span>thereum{" "}
          <span className="userAvatarHighlightTitle">L</span>isting{" "}
          <span className="userAvatarHighlightTitle">S</span>ervice
          <Badge
            className="userAvatarBadge"
            count={"Beta"}
            style={{ color: "#2a5af2" }}
            color="#b2c5ff"
          />
        </div>
      </div>
      <div className="walletButton">
        {/* <div className="userAvatarSubtitle">User: </div> */}
        <Button
          className="primaryButton walletPrimaryButton"
          onClick={handleWalletButtonClick}
          style={{ height: 40 }}
        >
          <Image
            className="foxImage"
            width={30}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/220px-MetaMask_Fox.svg.png"
          />
          <span className="walletButtonText">{buttonText}</span>
        </Button>
      </div>
    </>
  );
}
