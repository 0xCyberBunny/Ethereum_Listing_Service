import { Button, Input, Select } from "antd";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "../page.css";
import { UserAvatar } from "./user-avatar/user-avatar";
import { mockChartData } from "../mock-data";
import { graphqlClient, getCategoryNodes } from "../query";
import { submit } from "../api/submit";

function getChildren(nodes: any[], parentNodeId: string) {
  return nodes.filter((n) => {
    if (n.parent) {
      return n.parent.id === parentNodeId;
    }
    return false;
  });
}

function getRootNodes(nodes: any[]) {
  return nodes.filter((n) => !!n.isRoot);
}

function recursive(nodes: any[]): any[] {
  if (nodes.length > 0) {
    return nodes.map((node) => {
      const children = getChildren(mockChartData.data.categoryNodes, node.id);
      const n = recursive(children);
      return {
        id: node.id,
        value: {
          name: node.name,
        },
        children: n,
      };
    });
  }
  return [];
}

interface Props {
  fetchWallet: () => void;
  walletAddress: string;
}
export function CategorySummaryPage({ fetchWallet, walletAddress }: Props) {
  const navigation = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [nodes, setNodes] = useState<any[]>([]);
  const [selectOptions, setSelectOptions] = useState<any>([]);

  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");

  const [description, setDescription] = useState("");
  const [submitedCategory, setSubmitedCategory] = useState("");
  const handleNavToCategoryDetailsPage = (id: string) => {
    navigation(`/categories/${id}`);
  };
  const [fillOpacity, setFillOpacity] = useState(0);
  const [highlight, setHighlight] = useState(false);

  const handleSubmitbuttonClick: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement> = (_) => {
    setIsLoading(true);
    submit(category, item, description)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
    setSubmitedCategory(category);
    setCategory("");
    setItem("");
    setDescription("");
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleItemChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setItem(e.target.value);
  };
  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (submitedCategory && !isLoading) {
      if (fillOpacity < 1) {
        const interval = setInterval(() => {
          setFillOpacity(fillOpacity + 0.1);
        }, 25);

        return () => clearInterval(interval);
      } else {
        setHighlight(true);
      }
    }
  }, [submitedCategory, fillOpacity, isLoading]);

  useEffect(() => {
    if (highlight) {
      if (fillOpacity > 0) {
        const interval = setInterval(() => {
          setFillOpacity(fillOpacity - 0.1);
        }, 25);

        return () => clearInterval(interval);
      } else {
        setHighlight(false);
        setSubmitedCategory("");
      }
    }
  }, [highlight, fillOpacity]);

  useEffect(() => {
    graphqlClient
      .query(getCategoryNodes, {})
      .toPromise()
      .then((data) => {
        const categoryNodes: any[] = data.data.categoryNodes;

        const nodes = getRootNodes(categoryNodes).map((node: any) => {
          const children = getChildren(categoryNodes, node.id);
          const n = recursive(children);
          return {
            id: node.id,
            value: {
              name: node.name,
            },
            children: n,
          };
        });
        setNodes(nodes);

        const options = categoryNodes
          .filter((node) => !!node.isLeaf)
          .map((node) => {
            return {
              label: node.name,
              value: node.id,
            };
          });
        setSelectOptions(options);
      });
  }, []);

  return (
    <div className="pageContainer">
      <div className="userAvatarContainer">
        <UserAvatar fetchWallet={fetchWallet} walletAddress={walletAddress} />
      </div>
      <div className="pageHeader">
        <div className="postHeader">Post</div>
      </div>
      <div className="main">
        <div className="summary-page-posting">
          <div className="formGroup">
            <div className="inputGroup">
              <div className="inputGroupLabel">Category:</div>
              <Select
                className="primarySelect"
                onChange={handleCategoryChange}
                options={selectOptions}
              />
            </div>
            <div className="inputGroup">
              <div className="inputGroupLabel">Item:</div>
              <Input value={item} onChange={handleItemChange} />
            </div>
            <div className="inputGroup">
              <div className="inputGroupLabel">Description:</div>
              <Input.TextArea
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
              />
            </div>
            <div className="inputGroup">
              <Button
                onClick={handleSubmitbuttonClick}
                className="primaryButton"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="listing">
          <div className="categoryContainer">
            {nodes.map((node) => (
              <div className="categoryNodes">
                <Button
                  onClick={handleSubmitbuttonClick}
                  className="primaryButton categoryTitleButton"
                >
                  {node.value.name}
                </Button>
                {node.children.map((n: any) => {
                  return (
                    <Button
                      className="categoryCardButton"
                      type="text"
                      onClick={() => handleNavToCategoryDetailsPage(n.id)}
                    >
                      {n.value.name}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
