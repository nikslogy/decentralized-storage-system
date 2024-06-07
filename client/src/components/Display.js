import {useEffect, useState} from 'react';
import axios from "axios";
import fileIcon from "./image/file.jpg";
import { saveAs} from 'file-saver';
import downloadIcon from "./image/download.png";
import pdfIcon from "./image/PDF.jpg";
import docIcon from "./image/DOC.jpg";
import xlsIcon from "./image/XLS.jpg";
import pptIcon from "./image/PPT.jpg";
import deleteIcon from "./image/delete.png";
import "./Display.css";
const Display=({contract,folder,account,setDataSize})=>{
    const [data,setData]=useState("");
    const[options,setOptions]=useState(false);
    const downl=(url,fileName)=>{
        console.log(url);
        console.log(fileName);
        saveAs(url,fileName);
    }

    const deleteFile=(fileCID)=>{
        const apiEndpoint=`https://api.pinata.cloud/pinning/unpin/${fileCID}`;
        axios.delete(apiEndpoint,{
            headers:{
                'Content-Type':'application/json',
                pinata_api_key: "a2fcf19da1b4b72ea877",
            pinata_secret_api_key: "2996d5b699cd36d312b4b985755af3ef1325f5ae9d961839c1c7f827c03c11fe",

            }
        })
        .then(response=>{
            console.log("File deleted");
        })
        .catch(error=>{
            console.log("File not deleted");
        });
    };

    const del=async(fld,url,name)=>{
        console.log("swag")
        console.log(fld,url.substring(7))
        const rs=window.confirm(`Are sure to delete ${name} file?`);
        if(rs){
            
           console.log("Ok clicked");
           const rs=await  contract.delet(fld,url);
           if(rs)
                 deleteFile(url.substring(7));
           else
                console.log("Rejected");

        }
        else{
            console.log("Cancel clicked");
        }
        
    }
    const handleOption=async()=>{
        console.log("GRJF")
        setOptions(true);
    } 

    useEffect(()=>{
       getdata();
    },[]);

    const getdata=async()=>{
        
        const cids=[];
                
        const folderList2=await contract.getFolder(account);
        const folderList1=[...folderList2,"General"];
        
        console.log(folderList1)
        let [str11,str22]=[[],[]];
        for(let i=0;i<folderList1.length;i++)
        { 
            
            [str11,str22]=await contract.display(account,folderList1[i]);
           
           for(let j=0;j<str11.length;j++)
                        cids.push(str11[j].substring(7))
            //dataArray=dataArray.concat(dataArray1);
            //console.log(dataArray1)
        }
        console.log("Hey");
        console.log(cids);
        console.log("Hey");
        const promises = cids.map(cid => {
            return fetch(`https://api.pinata.cloud/data/pinList?status=pinned&hashContains=${cid}`, {
              headers: {
                 'Content-Type': 'application/json',
                 pinata_api_key: "a2fcf19da1b4b72ea877",
            pinata_secret_api_key: "2996d5b699cd36d312b4b985755af3ef1325f5ae9d961839c1c7f827c03c11fe",

              }
            })
            .then(response => response.json())
            .then(data => {
              if (data.count === 0) {
                console.log(`No pinned files found with CID ${cid}`);
                return 0;
              } else {
                let totalSize = 0;
                for (let i = 0; i < data.count; i++) {
                  totalSize += data.rows[i].size;
                }
                console.log(`Total size of files with CID ${cid}: ${(totalSize/1024)} Kilobytes`);
                return totalSize;
              }
            })
            .catch(error => console.error(error));
          });
          
          Promise.all(promises)
          .then(sizes => {
            const totalSize = sizes.reduce((acc, curr) => acc + curr, 0);
            console.log(`Total size of files with CIDs ${cids.join(', ')}: ${totalSize/1024/1024} Megabytes `);
            setDataSize((totalSize/1024/1024));
          })
          .catch(error => console.error(error));


        let dataArray=[];
        let folders1=[];
        let [str1,str2]=[[],[]];
        const Otheraddress = document.querySelector(".address3").value;
        //console.log(contract);
        try{
           
            if(Otheraddress){
                //dataArray=await contract.display(Otheraddress,folder);
                
                console.log("123333333333333333");
                console.log(Otheraddress);
                const folders=await contract.shareFolderAccess(Otheraddress);
                folders1=folders;
                console.log(folders);
                console.log("124444444444444444");
                let [str11,str22]=[[],[]];
                for(let i=0;i<folders.length;i++)
                { 
                    
                    [str11,str22]=await contract.display(Otheraddress,folders[i]);
                    str1=str1.concat(str11);
                    str2=str2.concat(str22);
                    
                    //dataArray=dataArray.concat(dataArray1);
                    //console.log(dataArray1)
                }
               console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
               console.log(dataArray);
                 
                //nameArray=await contract.getfname(Otheraddress);   
                //console.log(dataArray);
            }
            else{
                [str1,str2] =await contract.display(account,folder);
                //nameArray=await contract.getfname(account);
            }
        }
        catch(e){
            alert("You don't have access");
        }  
        console.log("Hii");
        console.log(dataArray);
        //console.log(nameArray);
        const isEmpty= Object.keys(str2).length===0;

        if(!isEmpty){
            console.log("hiiiiiiiiiiiiiii");
            console.log(str1);
            console.log(str2);
                        if(Otheraddress){
                            console.log("iiiiiiiiifffff")
                            const folders=await contract.shareFolderAccess(Otheraddress);
                           const images = await Promise.all(
                                folders.map(async(item1,j)=>{
                                [str1,str2]=await contract.display(Otheraddress,item1);
                                const images1= await Promise.all(str1.map(async(item,i)=>{
                                    return(
                                        <a>
                                        <div className='test1'>
                                        {str2[i].includes(".PDF") || str2[i].includes(".pdf") || str2[i].includes(".docx") || str2[i].includes(".xlsx") ?(<img 
                                        key={i} 
                                        src={fileIcon}
                                        alt="new"
                                        className="image-list"/>):(<img 
                                        key={i} 
                                        src={`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}`}
                                        alt="new"
                                        className="image-list"/>)}
                                        <div className='test11'>
                                
                                        <img src={downloadIcon} onClick={()=>downl(`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}` , str2[i])}/>    
                                        </div> 
                                        <div className='test12'>
                                        <a href={`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}`} key={i} target="_blank">{str2[i]}</a>
                                        </div> 
                                        </div>
                                        </a>
                                    )
                                }))
                                //console.log(images1)
                            return(
                                <a>
                                    <div className="folder-name">{item1}:</div>
                                    <div>
                                    {images1}
                                    </div>
                                </a>
                            )
                            }))
                           console.log(images)
                            setData(images);
                        }
                        else{
                            console.log("eeeeeellllllsssssssseeeeeeee")
                            //[str1,str2] =await contract.display(account,folder);
                            const images = str1.map((item,i)=>{
                                return(
                                    <a >
                                    <div className='test1'>
                                    
                                    {str2[i].includes(".jpg") || str2[i].includes(".JPG") || str2[i].includes(".jpeg") || str2[i].includes(".JPEG") || str2[i].includes(".png") || str2[i].includes(".PNG") ?(<img 
                                    key={i} 
                                    src={`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}`}
                                    alt="new"
                                    className="image-list"/>): str2[i].includes(".pdf") || str2[i].includes(".PDF") ? (<><img 
                                    key={i} 
                                    src={pdfIcon}
                                    alt="new"
                                    className="image-list"/> </>): str2[i].includes(".doc") || str2[i].includes(".docx") ?(<><img 
                                        key={i} 
                                        src={docIcon}
                                        alt="new"
                                        className="image-list"/> </>): str2[i].includes(".ppt") || str2[i].includes(".PPT") ?(<><img 
                                            key={i} 
                                            src={pptIcon}
                                            alt="new"
                                            className="image-list"/> </>): str2[i].includes(".xls") || str2[i].includes(".xlsx") ?(<><img 
                                                key={i} 
                                                src={xlsIcon}
                                                alt="new"
                                                className="image-list"/> </>):(<><img 
                                                    key={i} 
                                                    src={fileIcon}
                                                    alt="new"
                                                    className="image-list"/> </>)}
                                   
                                   
                                    <div className='test11'>
                                        <img src={downloadIcon} onClick={()=>downl(`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}` , str2[i])}/>    
                                    </div>
                                    <div className='test112'>
                                        <img src={deleteIcon} onClick={()=>del(folder,item,str2[i])}/>
                                    </div>
                                    <div className='test12'>
                                    <a href={`https://lavender-misleading-vicuna-170.mypinata.cloud/ipfs${item.substring(6)}`} key={i} target="_blank">{str2[i]}</a>
                                    </div> 
                                    </div>
                                    </a>
                                    );
                                });
                                setData(images);   
                        }
                        
            
        }else{
            alert("No image to display");
        }
    };
    return (
        <>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter Address"
              className="address3"
            ></input>
            <button className="button" onClick={getdata}>
              Get Data
            </button>
          </div>
          <div className="image-list">{data}</div>
        </>
      );
      
};
export default Display;