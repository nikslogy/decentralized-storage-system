import { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ folder, setModalOpen, contract }) => {
  const [accessList, setAccessList] = useState({});

  const sharing = async () => {
    const address = document.querySelector(".address1").value;
    console.log(folder);
    console.log(address);
    await contract.allow(address, folder);
    console.log("Shared");

  
    setAccessList((prevAccessList) => {
      const updatedAccessList = { ...prevAccessList };
      if (updatedAccessList[address]) {
        updatedAccessList[address].push(folder);
      } else {
        updatedAccessList[address] = [folder];
      }
      return updatedAccessList;
    });
  };

  const revoke = async (address, folder) => {
    await contract.disallow(address, folder);


    setAccessList((prevAccessList) => {
      const updatedAccessList = { ...prevAccessList };
      updatedAccessList[address] = updatedAccessList[address].filter(
        (f) => f !== folder
      );
      if (updatedAccessList[address].length === 0) {
        delete updatedAccessList[address];
      }
      return updatedAccessList;
    });
  };

  useEffect(() => {
    const fetchAccessList = async () => {
      const addressList = await contract.shareAccess();
      const accessObj = {};
      for (const item of addressList) {
        if (!accessObj[item[0]]) {
          accessObj[item[0]] = [item[1]];
        } else {
          accessObj[item[0]].push(item[1]);
        }
      }
      setAccessList(accessObj);
    };
    contract && fetchAccessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address1"
              placeholder="Enter Address"
              autoFocus
            ></input>
            <button className="share" onClick={() => sharing()}>
              Share
            </button>
          </div>
          <div className="tableWrapper">
            <table border={1}>
              <thead>
                <tr>
                  <th colSpan="3">People with access:</th>
                </tr>
                <tr>
                  <th>Address</th>
                  <th>Folder Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(accessList).map(([address, folders], index) => (
                  <tr key={index}>
                    <td>{address}</td>
                    <td>{folders.join(", ")}</td>
                    <td>
                      {folders.map((f, i) => (
                        <button
                          key={i}
                          className="revoke-button"
                          onClick={() => revoke(address, f)}
                        >
                          Revoke {f}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <button onClick={() => setModalOpen(false)}
            id="cancelBtn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
);
};

export default Modal;
