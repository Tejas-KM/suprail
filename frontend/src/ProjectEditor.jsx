import { useEffect, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ImageStudioNew from "./ImageNew";
import { useParams } from "react-router-dom";
import { getProjectById } from "./api/project";

export default function ProjectEditor() {
  const { id: projectId } = useParams();
  const [studioImage, setStudioImage] = useState(null);
  const [studioData, setStudioData] = useState(null);
  const [loading, setLoading] = useState(true); // default true on load

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);

        // Step 1: Fetch project metadata
        const data = await getProjectById(projectId);
        setStudioData(data?.predictionData);

        // Step 2: Fetch image blob from API
        const imageRes = await fetch(`${data.imageUrl}`);
        const imageBlob = await imageRes.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        setStudioImage(imageUrl);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Loading project...
        </div>
      </div>
    );
  }

  if (studioData && studioImage) {
    return <ImageStudioNew data={studioData} image={studioImage} projectId={projectId} />;
  }

  return (
    <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
      Failed to load project.
    </div>
  );
}
