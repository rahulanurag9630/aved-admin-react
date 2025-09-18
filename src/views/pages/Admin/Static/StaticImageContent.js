import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Divider,
} from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import toast from "react-hot-toast";
import uploadFile from "src/utils";

export default function StaticImageContent() {
    const history = useHistory();
    const location = useLocation();
    const { _id, contentType, imageUrl: initialImage } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialImage || "");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file)); // preview
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);

            let finalImageUrl = imageUrl;

            if (selectedFile) {
                const uploadedUrl = await uploadFile(selectedFile, setIsLoading);
                if (!uploadedUrl) {
                    toast.error("Image upload failed");
                    return;
                }
                finalImageUrl = uploadedUrl;
            }

            const response = await apiRouterCall({
                method: "PUT",
                endPoint: "updateStaticContent",
                bodyData: {
                    staticContentId: _id,
                    contentType,
                    imageUrl: finalImageUrl,
                },
            });

            if (response?.data?.responseCode === 200) {
                toast.success("Image updated successfully!");
                history.goBack();
            } else {
                toast.error(response?.data?.responseMessage || "Update failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            style={{
                maxWidth: 600,
                margin: "40px auto",
                borderRadius: 16,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    align="center"
                    style={{ fontWeight: "bold", marginBottom: 12 }}
                >
                    Update {contentType === "about" ? "About Page" : "Contact Us Page"} Image
                </Typography>

                <Divider style={{ marginBottom: 20 }} />

                {/* Image Preview */}
                {imageUrl && (
                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{
                                width: "100%",
                                maxWidth: 500,
                                borderRadius: 12,
                                border: "1px solid #eee",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                )}

                {/* Change Button */}
                <Box textAlign="center" mb={2}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="upload-image"
                    />
                    <label htmlFor="upload-image">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{
                                borderRadius: 20,
                                textTransform: "none",
                                fontWeight: "500",
                                padding: "6px 20px",
                            }}
                        >
                            Change Image
                        </Button>
                    </label>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => history.goBack()}
                        disabled={isLoading}
                        style={{
                            marginRight: "10px",
                            borderRadius: 20,
                            textTransform: "none",
                            padding: "6px 20px",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={isLoading}
                        style={{
                            borderRadius: 20,
                            textTransform: "none",
                            padding: "6px 20px",
                        }}
                    >
                        Save {isLoading && <ButtonCircularProgress />}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
