import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import dlog from "./components/image/dlogo.png";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Folder from "./components/Folder";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import { Helmet } from 'react-helmet';


function App() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [folder, setFolder] = useState("General");
  const [createFolder, setCreateFolder] = useState(false);
  const [profile, setProfile] = useState(false);
  const [copy, setCopy] = useState(false);
  const [dataSize, setDataSize] = useState(0);
  const [selectedItem, setSelectedItem] = useState("null");
  const [selectedMenuItem, setSelectedMenuItem] = useState("Home");


  const copied = () => {
    setTimeout(() => {
      setCopy(false);
    }, 1000);


    return (
      <>
        <p className="copied">Copied!</p>
      </>
    );
  };

  const handleAddressPopupClick = () => {
    setProfile(true);
  };


  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(account);
    console.log("clicked");
    setCopy(true);
  };

  function handleChange(e) {
    //console.log(folder);
    //setSelectedItem(e.target.value);
    setFolder(e.target.value);
    console.log(folder);
  }
  function copyAccount() {
    navigator.clipboard.writeText(account);
    console.log("clicked")
    setCopy(true);
  }
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload(true);
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload(true);
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress, Upload.abi, signer
        );

        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }

      const closePopupOnClickOutside = (e) => {
        if (
          !e.target.closest(".address-popup") &&
          !e.target.closest(".popup-content")
        ) {
          setProfile(false);
        } else {
          setProfile(true);
        }
      };

      document.addEventListener("click", closePopupOnClickOutside);

      return () => {
        document.removeEventListener("click", closePopupOnClickOutside);
      };

    };
    provider && loadProvider()

  }, []);



  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
      </Helmet>
      <div className="content-wrapper">
        <header className="header">
          <div className="upper">
            {account && <p className="meta">Metamask is connected ✅</p>}
            {!account && (
              <p className="meta-not">Metamask not connected ❌ Please try again</p>
            )}
          </div>
          <div className="address-popup" onClick={handleAddressPopupClick}>
            <i className="fas fa-user"></i>
            {profile && (
              <div className={`popup-content ${profile ? 'visible' : ''}`}>
                <i className="fas fa-user"></i>
                <p>{account}</p>
                <button className="copy-btn" onClick={handleCopyButtonClick}>
                  Copy
                </button>
                {copy && copied()}
              </div>
            )}
          </div>


          <nav>
            <div className="logo">
              <img src={dlog} alt="Website Logo" className="logo-image" />
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
            </div>
            <ul className={`menu ${menuActive ? "active" : ""}`}>
              <li>
                <a
                  href="#"
                  onClick={() => setSelectedMenuItem("Home")}
                  style={{ color: selectedMenuItem === "Home" ? "#f39c12" : "" }}
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setCreateFolder(true)}>
                  Open Folder
                </a>
                {createFolder && (
                  <Folder
                    setFolder={setFolder}
                    setCreateFolder={setCreateFolder}
                    folder={folder}
                    account={account}
                    contract={contract}
                  ></Folder>
                )}
              </li>
              <li>
                <a href="#" onClick={() => setModalOpen(true)}>
                  Share
                </a>
                {modalOpen && (
                  <Modal
                    folder={folder}
                    setModalOpen={setModalOpen}
                    contract={contract}
                  ></Modal>
                )}
              </li>
              <li>
                <a>
                  <div className="storage-usage">
                    <progress max="1024" value={dataSize > 0 ? Math.max(dataSize, 10) : 0}></progress>
                    <span>{dataSize.toFixed(2)}MB of 1GB used</span>
                  </div>
                </a>
              </li>

            </ul>
          </nav>
        </header>

        <div className="page-content">
          <main className="main-content">
            <div className="fld"><span>{folder}:</span></div>
            <div className="App">
              <br />
              <br />
              {dataSize!=1024 && <FileUpload
                account={account}
                provider={provider}
                contract={contract}
                folder={folder}
              ></FileUpload>}
              {dataSize==1024 && <h1 class="msg" >Storage is full...Please Buy Plan</h1>}
              {account && (
                <Display
                  contract={contract}
                  folder={folder}
                  account={account}
                  setDataSize={setDataSize}
                ></Display>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );

}
export default App;