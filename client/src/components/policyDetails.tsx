import React from "react";

function PolicyDetails() {
  return (
    <>
      <div className="box">
        <div className="dropdown" style={{ backgroundColor: "#edfff3" }}>
        Policy Details
        </div>

        <div className="policy-data">
          <div style={{fontSize:'1.3rem', fontWeight:'500'}}>Group Insurance Policy</div>
          <div className="cover" >

          <button
            className="btn1"
            style={{
                backgroundColor: "white",
                color: "black",
                border: "2px solid rgb(230, 233, 230)",
                padding:'1rem',
                marginLeft:'0'
            }}
            >
            500000
          </button>
              </div>
        </div>
      </div>
    </>
  );
}

export default PolicyDetails;
