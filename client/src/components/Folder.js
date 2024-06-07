import { useEffect, useState, useRef } from "react";
import "./Folder.css";

const Folder = ({ setFolder, setCreateFolder, folder, contract, account }) => {
  const [data1, setData1] = useState("");
  const [create, setCreate] = useState(false);
  const modalRef = useRef();
  

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setCreateFolder(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    const creating= async()=>{
        //console.log("HIII")
        const fld = document.querySelector(".fld-name").value;
        if(fld){
            //const folderList=await contract.getFolder(account);
            //const result = folderList.find(str => str ===fld);
            //if(!result){
                const rs=await contract.setFolder(account,fld);
                console.log(fld);
                setCreateFolder(false);
                setFolder(fld);
           // }
        }
    };
    function handleChange(e) {
        //console.log(folder);
        //setSelectedItem(e.target.value);
        setFolder(e.target.value);
        console.log(e.target.value);
      }
    useEffect(()=>{
        const folderList=async()=>{
            const folderList=await contract.getFolder(account);
            let select=document.querySelector("#selectNumber");
            const options=folderList;
            let e1;
            const images1 = options.map((item,i)=>{
                return(
<>
                        <option value={item}>{item}</option>
                        </>
                    );
                });
                setData1(images1);
            console.log("Bro1");
            console.log(account);

      /*      var selectList = document.getElementById("selectNumber");
while (selectList.options.length) {
  selectList.remove(0);
}*/

        
        }
        account && folderList();
    },[])



    return (
        <>
          <div className="modalBackground">
            <div className="modalContainer" ref={modalRef}>
              <div className="title">Folder</div>
              <select id="selectNumber" onChange={handleChange}>
                <option style={{ display: "none" }}>Select folder</option>
                <option value="General">General</option>
                {data1}
              </select>
    
              <div className="create-folder-container">
                {!create && (
                  <button className="plus" onClick={() => setCreate(true)}>
                    + Create New
                  </button>
                )}
                {create && <input className="fld-name" type="text" autoFocus />}
                {create && (
                  <button className="crtfld" onClick={() => creating()}>
                    Create Folder
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      );
    };
    export default Folder;