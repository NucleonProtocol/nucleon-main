import { useEffect, useState, memo, useCallback, SetStateAction } from "react";
import { Link } from "umi";
let connect: any;
let useStatus: any;
let useAccount: any;
let useChainId: any;
let useBalance: any;
let addChain: any;
let switchChain: any;
import {
  useStatus as useStatusDefault,
  useAccount as useAccountDefault,
  useChainId as useChainIdDefault,
  useBalance as useBalanceDefault,
  connect as connectDefault,
  addChain as addChainDefault,
  switchChain as switchChainDefault,
} from "@cfxjs/use-wallet-react/ethereum";
import {
  useStatus as useStatusMetaMask,
  useAccount as useAccountMetaMask,
  useChainId as useChainIdMetaMask,
  useBalance as useBalanceMetaMask,
  connect as connectMetaMask,
  addChain as addChainMetaMask,
  switchChain as switchChainMetaMask,
} from "@cfxjs/use-wallet-react/ethereum/MetaMask";
import {
  useStatus as useStatusFluent,
  useAccount as useAccountFluent,
  useChainId as useChainIdFluent,
  useBalance as useBalanceFluent,
  connect as connectFluent,
  addChain as addChainFluent,
  switchChain as switchChainFluent,
} from "@cfxjs/use-wallet-react/ethereum/Fluent";

import styles from "./../../../../layouts/index.less";
import style from "./index.less";

import logo from "./../../../../assets/logo.svg";
import logotxt from "./../../../../assets/logotxt.png";

import logometamask from "./../../../../assets/metamask.png";
import logofluent from "./../../../../assets/fluent.png";
import logodefault from "./../../../../assets/default.png";
import logotp from "./../../../../assets/tp.png";
import "./../../../../locales/config"; // 引用配置文件
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Carousel, Modal } from "antd";

let myacc: any;
let tmpAccount = localStorage.getItem("acc");
const AddChainParameter = {
  chainId: "0x406", // A 0x-prefixed hexadecimal string   0x47   0x406
  chainName: "conflux espace",
  nativeCurrency: {
    name: "CFX",
    symbol: "CFX", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://evm.confluxrpc.com"], // https://evmtestnet.confluxrpc.com  https://evm.confluxrpc.com
  //blockExplorerUrls: ['aaaa'],
  //iconUrls: ['https://'], // Currently ignored.
};

// web3 钱包登录
const WalletInfo: React.FC = memo(() => {
  const account = useAccount();
  // const chainId = useChainId()!;
  const balance = useBalance()!;
  const [chainId, setchainId] = useChainId()!;
  //const balanceT = balance?.toDecimalStandardUnit();
  //setStaketotal(balanceT);
  //init(balanceT);

  const handleClickSendTransaction = useCallback(async () => {
    if (!account) return;
    setTimeout(() => {
      // 加载隐藏
      (document.getElementById("spinner") as any).style.display = "none";
    }, 1000);
  }, [account]);
  if (tmpAccount != account) {
    localStorage.setItem("acc", account + "");
    location.reload();
  }
  return (
    <div onClick={handleClickSendTransaction}>
      {account?.slice(0, 7) +
        "..." +
        account?.slice(account.length - 5, account.length)}
    </div>
  );
});

let reloadTimer: any;
function reload() {
  reloadTimer = setTimeout(() => {
    if (!myacc || myacc == undefined) {
      //console.log(myacc);
      reload();
    } else {
      location.reload();
    }
  }, 1000);
  return () => clearTimeout(reloadTimer);
}

const warning = () => {
  Modal.warning({
    wrapClassName: styles.zzzz,
    bodyStyle: { backgroundColor: "#393942", color: "#ffffff" },
    content: "Wallet Not Install",
  });
};

function reloadPage() {
  setTimeout(function () {
    location.reload();
  }, 100)
}

// Function 切换网络--------------------------------------------
const onSwitchNetwork = async () => {
  try {
    var switchChainsucess = await switchChain("0x406"); // 切换网络
    reloadPage();
  } catch (error) {
    console.log(error);
    await addChain(AddChainParameter); // 添加网络
    reloadPage();
  }
};

function Header() {
  const currWallet = localStorage.getItem("currWallet") ? localStorage.getItem("currWallet") : "1";
  if (currWallet === '0') {
    useStatus = useStatusDefault;
    useAccount = useAccountDefault;
    useChainId = useChainIdDefault;
    useBalance = useBalanceDefault;
    connect = connectDefault;
    addChain = addChainDefault;
    switchChain = switchChainDefault
  } else if (currWallet === '1') {
    useStatus = useStatusMetaMask;
    useAccount = useAccountMetaMask;
    useChainId = useChainIdMetaMask;
    useBalance = useBalanceMetaMask;
    connect = connectMetaMask;
    addChain = addChainMetaMask;
    switchChain = switchChainMetaMask
  } else if (currWallet === '2') {
    useStatus = useStatusFluent;
    useAccount = useAccountFluent;
    useChainId = useChainIdFluent;
    useBalance = useBalanceFluent;
    connect = connectFluent;
    addChain = addChainFluent;
    switchChain = switchChainFluent
  }

  // web3 钱包登录状态
  const status = useStatus();
  myacc = useAccount();

  const [active, setActive] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLanguageOpen, setIsModalLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [languageList, setLanguageList] = useState([{ key: "en", name: 'English' }, { key: "zh", name: ' 中 文 ' }]);

  window.onhashchange = function () {
    switch (location.hash) {
      case "#/data/stake":
        setActive(0);
        break;
      case "#/data/unstake":
        setActive(0);
        break;
      case "#/data/pools":
        setActive(2);
        break;
      case "#/data/nut":
        setActive(3);
        break;
      case "#/data/rewards":
        setActive(4);
        break;
      case "#/data/analytics":
        setActive(5);
        break;

      default:
        break;
    }
  };

  const handleClickActvie = (index: SetStateAction<number>) => {
    setActive(index);
  };
  const { t, i18n } = useTranslation();

  // Function 切换钱包
  const onSwitchWallet = async (val: number) => {
    if (val === 0) {
      useStatus = useStatusDefault;
      useAccount = useAccountDefault;
      useChainId = useChainIdDefault;
      useBalance = useBalanceDefault;
      connect = connectDefault;
      addChain = addChainDefault;
      switchChain = switchChainDefault
    } else if (val === 1) {
      connect = connectMetaMask;
      useStatus = useStatusMetaMask;
      useAccount = useAccountMetaMask;
      useChainId = useChainIdMetaMask;
      useBalance = useBalanceMetaMask;
      connect = connectMetaMask;
      addChain = addChainMetaMask;
      switchChain = switchChainMetaMask
    } else if (val === 2) {
      connect = connectFluent;
      useStatus = useStatusFluent;
      useAccount = useAccountFluent;
      useChainId = useChainIdFluent;
      useBalance = useBalanceFluent;
      connect = connectFluent;
      addChain = addChainFluent;
      switchChain = switchChainFluent
    }
    localStorage.setItem("currWallet", val.toString())
    connect();
  };

  const connectShow = async () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLanguageOk = () => {
    setIsModalLanguageOpen(true);
  };
  const handleLanguageCancel = () => {
    setIsModalLanguageOpen(false);
  };

  const onSwitchLanguage = async (key: any) => {
    i18n.changeLanguage(key);
    setLanguage(key);
    localStorage.setItem("ln", key);
    handleLanguageCancel();
  };


  const chainId = useChainId()!; // 正式网 测试网
  // console.log(chainId);
  // setTimeout(() => {
  //   if (chainId != "71") {
  //       setShowSwitch(true);
  //     }
  //   console.log(chainId);
  // }, 10);
  // setInterval(() => {
  //   if (chainId != "71") {
  //       setShowSwitch(true);
  //     }
  //   console.log(chainId);
  // }, 5000);
  // 定时更新数据
  const [count, setCount] = useState(10);
  useEffect(() => {
    // 初始化上次语言
    let ln = localStorage.getItem("ln") ? localStorage.getItem("ln")?.toString() : 'en';
    i18n.changeLanguage(ln);
    setLanguage(ln+'');

    let timerId: string | number | NodeJS.Timeout | null | undefined = null;
    const run = () => {
      if (count <= 0) {
        return () => {
          timerId && clearTimeout(timerId);
        };
      }
      setCount(count - 1);
      timerId = setTimeout(run, 2000);
      // 这下面为相关的业务代码
      if (chainId != "1030") {
        setShowSwitch(true);
      } else {
        setShowSwitch(false);
      }
    };
    timerId = setTimeout(run, 2000);
    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [count]);

  useEffect(() => {
    const urlT = window.location.hash;

    switch (urlT) {
      case "#/data/stake":
        setActive(0);
        break;
      case "#/data/unstake":
        setActive(0);
        break;
      case "#/data/pools":
        setActive(2);
        break;
      case "#/data/nut":
        setActive(3);
        break;
      case "#/data/rewards":
        setActive(4);
        break;
      case "#/data/analytics":
        setActive(5);
        break;

      default:
        break;
    }

    // 网路判断
    setTimeout(() => {
      if (chainId != "1030") {
        setShowSwitch(true);
      } else {
        setShowSwitch(false);
      }
    }, 20);

    setTimeout(() => {
      if (!myacc || myacc == undefined) {
        reload();
      }
    }, 1000);
  }, []);

  return (
    <div className={style.nav0} style={{ position: "relative" }}>
      <div className={style.sub_nav}>
        <Link to="/"
          onClick={() => {
            handleClickActvie(0);
          }}
          style={{ color: "#FFF" }}>
          <img className={styles.logoimg} src={logo} height="30px" />
          <img className={styles.logotxt} src={logotxt} height="16px" />
        </Link>
        <div className={style.sub_nav_sub + ' ' + styles.bigshow}>
          <Link
            to="/data/stake"
            onClick={() => {
              handleClickActvie(0);
            }}
            style={{ color: active === 0 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_stake")}
          </Link>
          <Link
            to="/data/pools"
            onClick={() => {
              handleClickActvie(2);
            }}
            style={{ color: active === 2 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_pools")}
          </Link>
          <Link
            to="/data/nut"
            onClick={() => {
              handleClickActvie(3);
            }}
            style={{ color: active === 3 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_nut")}
          </Link>
          <Link
            to="/data/rewards"
            onClick={() => {
              handleClickActvie(4);
            }}
            style={{
              color: active === 4 ? "#EAB764" : "#FFF",
              display: "none",
            }}
          >
            {t("stake.nav_rewards")}
          </Link>
        </div>
        <div className={style.account_box}>
          <Link
            to="/data/analytics"
            onClick={() => {
              handleClickActvie(5);
            }}
            style={{
              color: active === 5 ? "#EAB764" : "#FFF",
              fontSize: "18px",
              marginRight: "25px",
            }}
            className={styles.bigshowline}
          >
            {t("stake.nav_analytics")}
          </Link>
          {status !== "in-detecting" && status !== "active" && (
            <div style={{ display: "inline-block" }}>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={connectShow}
              >
                {status === "in-activating" && "connecting..."}
              </div>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={connectShow}
              >
                {status === "not-installed" && "Connect Wallet"}
              </div>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={connectShow}
              >
                {status === "not-active" && "Connect Wallet"}
              </div>
            </div>
          )}
          <div
            style={{ display: showSwitch === true ? "none" : "inline-block" }}
          >
            <div
              style={{ display: status === "active" ? "inline-block" : "none" }}
              className={style.account}
            >
              {status === "active" && <WalletInfo />}
              <div className={style.yuan}></div>
            </div>
          </div>
          <div
            style={{ display: (showSwitch === true && status === "active") ? "inline-block" : "none" }}
          >
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                cursor: "pointer",
              }}
              className={style.account}
              onClick={() => {
                onSwitchNetwork();
              }}
            >
              Switch Network
            </div>
          </div>
          <div onClick={handleLanguageOk} style={{ display: "inline-block", verticalAlign: "baseline", margin: "0 0 0 10px", color: "#fff", borderRadius: "3px", cursor: "pointer", fontSize: "16px", padding: "2px 5px", backgroundColor: "#e5a455", textTransform: "Capitalize" }}>{language}</div>
        </div>
      </div>
      <div className={style.sub_nav_sub + ' ' + styles.smallshow} style={{
        left: "35px",
        top: "100px"
      }}>
        <Link
          to="/data/stake"
          onClick={() => {
            handleClickActvie(0);
          }}
          style={{ color: active === 0 ? "#EAB764" : "#FFF" }}
        >
          {t("stake.nav_stake")}
        </Link>
        <Link
          to="/data/pools"
          onClick={() => {
            handleClickActvie(2);
          }}
          style={{ color: active === 2 ? "#EAB764" : "#FFF" }}
        >
          {t("stake.nav_pools")}
        </Link>
        <Link
          to="/data/nut"
          onClick={() => {
            handleClickActvie(3);
          }}
          style={{ color: active === 3 ? "#EAB764" : "#FFF" }}
        >
          {t("stake.nav_nut")}
        </Link>
        <Link
          to="/data/rewards"
          onClick={() => {
            handleClickActvie(4);
          }}
          style={{
            color: active === 4 ? "#EAB764" : "#FFF",
            display: "none",
          }}
        >
          {t("stake.nav_rewards")}
        </Link>
        <Link
          to="/data/analytics"
          onClick={() => {
            handleClickActvie(5);
          }}
          style={{
            color: active === 5 ? "#EAB764" : "#FFF",
            fontSize: "18px",
            marginRight: "25px",
          }}
        >
          {t("stake.nav_analytics")}
        </Link>
      </div>
      <Modal className={style.sw} title="Select a Wallet" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {/* <div style={{margin:"5px"}}>
          <Button icon={<img src={logodefault} height="20px" style={{float:"right"}} />} block onClick={() => {
            onSwitchWallet(0);
          }}> Default </Button></div> */}
        <div style={{ margin: "5px" }}>
          <Button icon={<img src={logometamask} height="19px" style={{ float: "right" }} />} block onClick={() => {
            onSwitchWallet(1);
          }}> MetaMask </Button>
        </div>
        <div style={{ margin: "5px" }}>
          <Button icon={<img src={logofluent} height="24px" style={{ float: "right" }} />} block onClick={() => {
            onSwitchWallet(2);
          }}> Fluent </Button>
        </div>
        <div style={{ margin: "5px" }}>
          <Button icon={<img src={logotp} height="24px" style={{ float: "right" }} />} block onClick={() => {
            onSwitchWallet(0);
          }}> TokenPocket </Button>
        </div>
      </Modal>
      <Modal className={style.sw} style={{ maxWidth: "90%" }} title="Select Language" open={isModalLanguageOpen} onCancel={handleLanguageCancel}>
        <div style={{ margin: "5px" }}>
          {languageList.map((item: any) => {
            return (
              <Button style={{textAlign:"center"}} block onClick={() => {
                onSwitchLanguage(item.key);
              }}> {item.name} </Button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default Header;
