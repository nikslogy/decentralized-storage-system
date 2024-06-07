// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {

  struct Access{
     address user;
     string folder; 
     bool access; //true or false
  }

 struct fdata{
    string url;
    string name; 
}
mapping(address=>mapping(string=>fdata[])) value;
mapping(address=>string[]) folder;
mapping(address=>mapping(address=>mapping(string=>bool))) ownership;
mapping(address=>Access[]) accessList;
mapping(address=>mapping(address=>mapping(string=>bool))) previousData;

constructor(){
    folder[msg.sender].push("General");
}
function setValue(address _address, string memory _folder, string memory _url, string memory _name) public {
    value[_address][_folder].push(fdata(_url,_name));

    }


function display(address _address,string memory _folder) public view returns (string[] memory,string[] memory) {
    fdata[] memory dataList=value[_address][_folder];
    string[] memory urls=new string[](dataList.length);
    string[] memory names=new string[](dataList.length);
    for(uint i=0;i<dataList.length;i++){
       
            urls[i]=dataList[i].url;
            names[i]=dataList[i].name;
     
    }
    return (urls,names);
}

function delet(string memory _folder, string memory _url) public {
    //fdata[] storage dataArr = value[msg.sender][_name];
    for (uint256 i = 0; i < value[msg.sender][_folder].length; i++) {
        if (compareStrings(value[msg.sender][_folder][i].url,_url)) {
            if (value[msg.sender][_folder].length > 1) {
                if(i!=value[msg.sender][_folder].length-1){
                    for(uint j=i;j<value[msg.sender][_folder].length-1;j++){
                        value[msg.sender][_folder][j] = value[msg.sender][_folder][j+1];
                    }
                }
                            }
            value[msg.sender][_folder].pop();
            break;
        }
    }
}



function setFolder(address _address,string memory _folder)public {
    folder[_address].push(_folder);
}
function getFolder(address _address) public view returns (string[] memory){
return folder[_address];
}
  function compareStrings(string storage a, string memory b) internal view returns(bool) {
    bytes storage aBytes = bytes(a);
    bytes memory bBytes = bytes(b);
    if(aBytes.length != bBytes.length) {
        return false;
    }
    for(uint i = 0; i < aBytes.length; i++) {
        if(aBytes[i] != bBytes[i]) {
            return false;
        }
    }
    return true;
}

 function allow(address user,string memory _folder) external {//def
      ownership[msg.sender][user][_folder]=true; 
      if(previousData[msg.sender][user][_folder]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user && compareStrings(accessList[msg.sender][i].folder,_folder)){
                  accessList[msg.sender][i].access=true; 
             }
         }
      }else{
          accessList[msg.sender].push(Access(user,_folder,true));  
          previousData[msg.sender][user][_folder]=true;  
      }

  }



 function disallow(address user,string memory _folder) public{
      ownership[msg.sender][user][_folder]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user && compareStrings(accessList[msg.sender][i].folder,_folder)){ 
              accessList[msg.sender][i].access=false;  
          }
      }
  }

function shareFolderAccess(address _address) public view returns (string[] memory) {
Access[] memory data=accessList[_address];
 string[] memory folderArray = new string[](data.length);
    uint count = 0;
    for (uint i = 0; i < data.length; i++) {
        if (data[i].user == msg.sender && data[i].access==true) {
            folderArray[count] = data[i].folder;
            count++;
        }
    }
    string[] memory result = new string[](count);
    for (uint i = 0; i < count; i++) {
        result[i] = folderArray[i];
    }
    return result;

}

  function shareAccess() public view returns(Access[] memory){
     Access[] memory data=accessList[msg.sender];
     Access[] memory data1=new Access[](data.length);
     uint count=0;
     for (uint i = 0; i < data.length; i++) {
        if(data[i].access){ 
              data1[count]=data[i];
              //data1[count].user=data[i].user;
              //data1[count].folder=data[i].folder;
              //data1[count].access=data[i].access;
              count++;
          }
     }
     Access[] memory data2=new Access[](count);
     for (uint i = 0; i < data2.length; i++) {
        data2[i]=data1[i];
     }
      return data2;
  }
}