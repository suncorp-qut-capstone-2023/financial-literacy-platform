"use client";
import { useState, useEffect, useContext } from "react";
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import ModuleOverview from "@/components/ModuleOverview"; // Import the new ModuleOverview component
import { AuthContext } from "@/app/auth.jsx";
import { Box } from "@mui/material";

// Module creation imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken, userType } = useContext(AuthContext); // Combine into one useContext call

  // module creation constants
  const [open, setOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");

  const handleCreateModule = async () => {
    try {
      const response = await fetch(
        `https://jcmg-api.herokuapp.com/api/course/module/create?courseID=${params.courseId}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            module_name: moduleName,
            module_order: Number(moduleOrder), // Ensure the module order is a number
          }),
        }
      );

      if (response.ok) {
        fetchData(); // Refresh the modules list
      } else {
        console.error("Failed to create module. Status:", response.status);
      }
    } catch (error) {
      console.error("Error creating module:", error);
    }
    setOpen(false); // Close the modal after attempting to create module
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleModuleRemoved = (removedModuleId) => {
    if (course && course.modules) {
      const updatedModules = course.modules.filter(
        (module) => module.MODULE_ID !== removedModuleId
      );
      setCourse((prevCourse) => ({
        ...prevCourse,
        modules: updatedModules,
      }));
    }
  };

  const fetchData = async () => {
    try {
      console.log(params.courseId);
      const response = await fetch(
        `https://jcmg-api.herokuapp.com/api/course?courseID=${params.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("Data: ", data);
      setCourse(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, [params.courseId, authToken]);

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          {userType === "admin" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                Create Module
              </Button>
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create a New Module</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Module Name"
                    type="text"
                    fullWidth
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Module Order"
                    type="number"
                    fullWidth
                    value={moduleOrder}
                    onChange={(e) => setModuleOrder(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateModule} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
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
          ) : course && course.modules && course.modules.length > 0 ? (
            <div className={styles.modulesSection}>
              <h1 className={styles.title}>{course && course.COURSE_NAME}</h1>
              <h2 className={styles.subtitle}>Modules</h2>
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                className={styles.courseCardBox}
              >
                {course.modules.map((module) => (
                  <ModuleOverview
                    key={module.MODULE_ID}
                    courseId={course.COURSE_ID}
                    moduleId={module.MODULE_ID}
                    moduleName={module.MODULE_NAME}
                    onModuleRemoved={handleModuleRemoved}
                    cms={userType === "admin"}
                    refreshModules={fetchData}
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
              No Modules Available
            </Box>
          )}
        </div>
      </div>
    </main>
  );
}
