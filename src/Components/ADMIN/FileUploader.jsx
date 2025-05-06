import React, { useState } from "react";
import background from "../../assets/cyber-7121610_1280.jpg";
import { FaUpload } from "react-icons/fa";

// import uploadImg from "../../assets/upload.png"; // Make sure this image exists

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (validTypes.includes(fileType)) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a valid CSV or Excel file.");
      }
    }
  };

  const container = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const wrapperStyle = {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div style={container}>
      <style>{`
        .parent {
          width: 450px;
          margin: auto;
          padding: 2rem;
          background: transparent;
          background: linear-gradient(147deg, rgba(0, 0, 0, .5) 0%, rgba(48, 191, 105, .5) 89%);
          backdrop-filter: blur(30px);
          border-radius: 25px;
          box-shadow: 7px 20px 20px rgb(66, 102, 85);
          color:rgb(255, 255, 255);
        }

        .file-upload {
          text-align: center;
          border: 3px dashed rgb(210, 227, 244);
          padding: 1.5rem;
          position: relative;
          cursor: pointer;
          color
        }

        .file-upload p {
          font-size: 0.87rem;
          margin-top: 10px;
          color:rgb(255, 255, 255);
        }

        .file-upload input {
          display: block;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          opacity: 0;
          cursor: pointer;
        }

        .button-49,
        .button-49:after {
          width: 150px;
          height: 76px;
          line-height: 78px;
          font-size: 20px;
          font-family: 'Bebas Neue', sans-serif;
          background: linear-gradient(45deg, transparent 5%, #FF013C 5%);
          border: 0;
          color: #fff;
          letter-spacing: 3px;
          box-shadow: 6px 0px 0px #00E6F6;
          outline: transparent;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          margin-top: 20px;
        }

        .button-49:after {
          --slice-0: inset(50% 50% 50% 50%);
          --slice-1: inset(80% -6px 0 0);
          --slice-2: inset(50% -6px 30% 0);
          --slice-3: inset(10% -6px 85% 0);
          --slice-4: inset(40% -6px 43% 0);
          --slice-5: inset(80% -6px 5% 0);
          
          content: 'ALTERNATE TEXT';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 3%, #00E6F6 3%, #00E6F6 5%, #FF013C 5%);
          text-shadow: -3px -3px 0px #F8F005, 3px 3px 0px #00E6F6;
          clip-path: var(--slice-0);
        }

        .button-49:hover:after {
          animation: glitch 1s steps(2, end);
        }

        @keyframes glitch {
          0%   { clip-path: var(--slice-1); transform: translate(-20px, -10px); }
          10%  { clip-path: var(--slice-3); transform: translate(10px, 10px); }
          20%  { clip-path: var(--slice-1); transform: translate(-10px, 10px); }
          30%  { clip-path: var(--slice-3); transform: translate(0px, 5px); }
          40%  { clip-path: var(--slice-2); transform: translate(-5px, 0px); }
          50%  { clip-path: var(--slice-3); transform: translate(5px, 0px); }
          60%  { clip-path: var(--slice-4); transform: translate(5px, 10px); }
          70%  { clip-path: var(--slice-2); transform: translate(-10px, 10px); }
          80%  { clip-path: var(--slice-5); transform: translate(20px, -10px); }
          90%  { clip-path: var(--slice-1); transform: translate(-10px, 0px); }
          100% { clip-path: var(--slice-1); transform: translate(0); }
        }
      `}</style>

      <div style={wrapperStyle}>
        <div className="parent">
          <div className="file-upload">
            <FaUpload size={40} color="#00E6F6" />
            <h3>Click box to upload</h3>
            <p>Maximum file size 10mb</p>
            <input
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
          {file && (
            <p style={{ color: "green", fontSize: "0.9rem" }}>
              File selected: {file.name}
            </p>
          )}
          <button className="button-49" role="button">
            Analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
