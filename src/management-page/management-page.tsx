import { Button, Input, Select } from "antd";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import "../page.css";
import { OrganizationGraph } from "@ant-design/graphs";
import { graphqlClient, getCategoryNodes } from "../query";
import { UserAvatar } from "../category-summary-page/user-avatar/user-avatar";
import { add_category } from "../api/add-category";

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
      const children = getChildren(nodes, node.id);
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

const fakeRootNode = {
  id: "0",
  value: {
    name: "Current Listing",
  },
  children: [],
};
interface Props {
  fetchWallet: () => void;
  walletAddress: string;
}
export function ManagementPage({ fetchWallet, walletAddress }: Props) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectOptions, setSelectOptions] = useState<any>([]);

  const [category, setCategory] = useState("");
  const [parent, setParent] = useState("");

  const [submitedCategory, setSubmitedCategory] = useState("");
  const [fillOpacity, setFillOpacity] = useState(0);
  const [highlight, setHighlight] = useState(false);

  const fetchCategoryNodes = () => {
    graphqlClient
      .query(getCategoryNodes, {})
      .toPromise()
      .then((data) => {
        const categoryNodes: any[] = data.data.categoryNodes;
        const nodes: any[] = getRootNodes(categoryNodes).map((node: any) => {
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
        setNodes([{ ...fakeRootNode, children: nodes }]);
        const options = categoryNodes
          .filter((node) => !!node.isRoot)
          .map((node) => {
            return {
              label: node.name,
              value: node.id,
            };
          });

        setSelectOptions(options);
      });
  };

  const handleSubmitbuttonClick: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement> = (_) => {
    add_category(parent, category)
      .then(() => {
        setSubmitedCategory(category);
        setCategory("");
        fetchCategoryNodes();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleParentChange = (value: string) => {
    setParent(value);
  };

  const handleCategoryChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    if (submitedCategory) {
      if (fillOpacity < 1) {
        const interval = setInterval(() => {
          setFillOpacity(fillOpacity + 0.1);
        }, 25);

        return () => clearInterval(interval);
      } else {
        setHighlight(true);
      }
    }
  }, [submitedCategory, fillOpacity]);

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
    fetchCategoryNodes();
  }, []);

  return (
    <div className="pageContainer">
      <div className="userAvatarContainer">
        <UserAvatar fetchWallet={fetchWallet} walletAddress={walletAddress} />
      </div>
      <div className="managementPageMain">
        <div className="posting">
        <div className="DAOHeader">DAO Management</div>
          <div className="formGroup">
            <div className="inputGroup">
              <div className="inputGroupLabel">Parent:</div>
              <Select
                className="primarySelect"
                onChange={handleParentChange}
                options={selectOptions}
              />
            </div>
            <div className="inputGroup">
              <div className="inputGroupLabel">Category:</div>
              <Input value={category} onChange={handleCategoryChange} />
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
        <div className="managementPageListing">
          <div className="chartContainer">
            {nodes.map((node) => (
              <OrganizationGraph
                key={node.id}
                className="chart"
                autoFit={true}
                data={node}
                // onReady={(graph) => {
                //   graph.on("node:click", (e) => {
                //     const nodeId = e.item!._cfg!.id!;
                //     // for diff the chart expand/collapse marker with the node
                //     if (e.shape.cfg.attrs) {
                //       handleNavToCategoryDetailsPage(nodeId);
                //     }
                //   });
                // }}
                animate={false}
                markerCfg={(cfg) => {
                  const show = !!(
                    cfg.children && (cfg.children as []).length > 0
                  );
                  return {
                    position: "bottom",
                    show,
                  };
                }}
                edgeCfg={{
                  endArrow: false,
                }}
                nodeCfg={{
                  style: (node: any) => {
                    const id = node["id"];
                    if (id === submitedCategory) {
                      return {
                        cursor: "pointer",
                        stroke: "red",
                        fill: "red",
                        fillOpacity,
                      };
                    }

                    return {
                      fill: "#f5f7ff",
                      cursor: "pointer",
                    };
                  },
                  label: {
                    style: (_node: any, _group: any, type: any): any => {
                      if (type === "name") {
                        return {
                          fill: "#062ca2",
                          fontWeight: "14px",
                        };
                      }
                    },
                  },
                }}
                // drag-canvas
                behaviors={["zoom-canvas"]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
