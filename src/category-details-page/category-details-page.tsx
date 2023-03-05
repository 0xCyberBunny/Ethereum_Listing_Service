import { Card } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserAvatar } from "../category-summary-page/user-avatar/user-avatar";
import { getCategoryNodes, getItemsById, graphqlClient } from "../query";
import "../page.css";

interface Props {
  fetchWallet: () => void;
  walletAddress: string;
}
export function CategoryDetailsPage({ fetchWallet, walletAddress }: Props) {
  const { categoryId } = useParams();
  const [categoryNodes, setCategoryNodes] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const getCategoryName = () => {
    const node = categoryNodes.filter((node) => node.id === categoryId);
    if (node.length > 0) {
      const ownedName = node[0].name;
      const parentName = node[0].parent?.name;

      const parentNode = categoryNodes.filter(
        (n) => n.id === node[0].parent?.id
      );
      const grandParentName = parentNode[0].parent?.name
        ? `${parentNode[0].parent?.name} > `
        : "";

      return `${grandParentName}${parentName} > ${ownedName}`;
    } else {
      return "";
    }
  };

  useEffect(() => {
    graphqlClient
      .query(getItemsById, { id: categoryId })
      .toPromise()
      .then((data) => {
        setItems(data.data.postingItems);
      });
  }, [categoryId]);

  useEffect(() => {
    graphqlClient
      .query(getCategoryNodes, {})
      .toPromise()
      .then((data) => {
        const categoryNodes: any[] = data.data.categoryNodes;
        setCategoryNodes(categoryNodes);
      });
  }, []);

  return (
    <div className="pageContainer">
      <div className="userAvatarContainer">
        <UserAvatar fetchWallet={fetchWallet} walletAddress={walletAddress} />
      </div>
      <div className="categoryDetailsHeader">{getCategoryName()}</div>
      <div className="listing">
        <div className="itemCardsContainer">
          {items.map((item, index) => {
            return (
              <Card
                key={item.id}
                title={`[${item.title}]`}
                className={`itemCard_${index % 3}`}
              >
                <div>Owner: {item.owner}</div>
                <div>
                  Created Time:{" "}
                  {new Date(+item.createdAt * 1000).toLocaleString()}
                </div>
                <div>Description: {item.description}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
