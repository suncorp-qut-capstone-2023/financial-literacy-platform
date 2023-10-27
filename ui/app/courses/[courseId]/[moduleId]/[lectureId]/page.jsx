"use client";

import { useState, useEffect, useContext } from "react";
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import MaterialOverview from "@/components/materialOverview"; // Import the new ModuleOverview component
import { AuthContext } from "@/app/auth.jsx";
import { Box } from "@mui/material";

// imports for lecture content upload button
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function LecturePage({ params }) {
  const [lectureContents, setLectureContents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [materialName, setMaterialName] = useState("");
  // const [fileName, setFileName] = useState("");

  const handleOpenUploadDialog = () => {
    alert(
      "Unfortunately, uploading of any content is unable to be processed as there is no API endpoint that allows this frontend to interact with uploading files to the backend. Uploading of content is able to be done via Postman interacting directly with the backend service. Please refer to the documentation provided by the backend team on how to do this. We apologise for the inconvenience."
    );
    // setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  // const handleUploadSubmit = () => {
  //   // API call to submit/upload material goes here...
  //   // After a successful upload, you'd also likely want to update your lectureContents state

  //   setUploadDialogOpen(false);
  // };

  // const handleUpload = (event) => {
  //   const file = event.target.files[0];
  //   setFileName(file.name);
  // };

  useEffect(() => {
    async function fetchLectureMaterials() {
      try {
        const url = `https://jcmg-api.herokuapp.com/api/course/module/lecture/contents?lectureID=${params.lectureId}`;
        console.log("Fetching from URL:", url); // Log the URL to check if course and module IDs are correct

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          console.error("Error response from server:", response);
          return; // If response is not ok, log the error and return
        }

        const data = await response.json();
        console.log("Data: ", data);
        setLectureContents(data);
        setIsComplete(true);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchLectureMaterials();
  }, [params.courseId, params.moduleId, authToken]);

  useEffect(() => {
    async function fetchLectureMaterialName() {
      for (let i = 0; i < lectureContents.length; i++) {
        try {
          const url = `https://jcmg-api.herokuapp.com/api/course/module/lecture/content/media?materialID=${lectureContents[i].MATERIAL_ID}`;
          console.log("Fetching from URL:", url); // Log the URL to check if course and module IDs are correct

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!response.ok) {
            console.error("Error response from server:", response);
            return; // If response is not ok, log the error and return
          }

          const material = await response.json();
          lectureContents[i].MATERIAL_NAME = material[0].MATERIAL_NAME;
        } catch (error) {
          console.error("Error fetching material data:", error);
        }
      }
      setIsLoading(false);
    }

    fetchLectureMaterialName();
  }, [isComplete]);

  // Check if course is defined, if not then render loading or some other content
  if (!lectureContents && !isLoading) {
    return <div>Module not found</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>
            {lectureContents && lectureContents.COURSE_NAME}
          </h1>
          {userType === "admin" && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenUploadDialog}
            >
              Upload Materials
            </Button>
          )}
          {/* <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
            <DialogTitle>Upload Material</DialogTitle>
            <DialogContent>
              <form onSubmit={handleUploadSubmit}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Material Name"
                  fullWidth
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" onChange={handleUpload} />
                </Button>
                <TextField
                  margin="dense"
                  label="File to Upload"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  value={fileName}
                />
              </form>

               Any other fields related to the material upload can go here 

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUploadDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUploadSubmit} color="primary">
                Publish
              </Button>
            </DialogActions>
          </Dialog> */}

          {isLoading ? (
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              className={styles.courseCardBox}
            >
              <Loading />
            </Box>
          ) : lectureContents && lectureContents.length > 0 ? (
            <div className={styles.modulesSection}>
              <h2 className={styles.subtitle}>Lecture Materials</h2>
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                className={styles.courseCardBox}
              >
                {lectureContents.map((lectureContent) => (
                  <MaterialOverview
                    key={lectureContent.LECTURE_CONTENT_ID}
                    courseId={params.courseId}
                    moduleId={params.moduleId}
                    lectureId={lectureContent.LECTURE_ID}
                    lectureContentId={lectureContent.LECTURE_CONTENT_ID}
                    materialId={lectureContent.MATERIAL_ID}
                    materialName={lectureContent.MATERIAL_NAME}
                    materialOrder={lectureContent.MATERIAL_ORDER}
                    // onLectureRemoved={handleLectureRemoved} // make sure this function is defined
                    cms={userType === "admin"}
                  />
                ))}
              </Box>
            </div>
          ) : (
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              className={styles.courseCardBox}
            >
              No Materials for this Lecture
            </Box>
          )}
        </div>
      </div>
    </main>
  );
}
