import {
  createPostAsync,
  getPostsAsync,
  selectLoadingPost,
} from "@/redux/reducers/postReducers";
import { useAppDispatch } from "@/redux/store";
import { Post } from "@/types/Posts";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CameraIcon, ImageIcon } from "../icons";
import ImageShow from "../MediaShow/ImageShow";
import VideoShow from "../MediaShow/VideoShow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  data?: Post;
}

const ModalCreatePost = ({ isOpen, onClose, isEdit, data }: Props) => {
  const dispatch = useAppDispatch();

  const [content, setContent] = useState("");
  const [images, setImages] = useState<any[]>([]);

  const [stream, setStream] = useState(false);
  const videoRef = useRef<any>();
  const refCanvas = useRef<any>();
  const [tracks, setTracks] = useState<any>("");

  const isLoading = useSelector(selectLoadingPost);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();

          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => toast.error("Something went wrong. Please try again."));
    }
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleChangeImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let err = "";
    let newImages: File[] = [];

    if (files) {
      Array.from(files).forEach((file: File) => {
        if (!file) {
          err = "File does not exist!";
          return;
        }

        if (file.size > 1024 * 1024 * 5) {
          err = "The image largest is 5mb!";
          return;
        }

        newImages.push(file);
      });
    }

    if (err) {
      toast.error(err);
    }

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages((prev) => [...prev, { camera: URL }]);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select an image!");
      return;
    }

    try {
      await dispatch(createPostAsync({ content, images }));

      dispatch(getPostsAsync());
      toast.success("Create a post success!!!");
      setImages([]);
      setContent("");
      if (stream) {
        handleStopStream();
      }
      onClose();
    } catch (err: any) {
      if (err.message) toast.error(err.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (isEdit && data) {
      setContent(data.content);
      setImages(data.images);
    }
  }, [isEdit, data]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (stream) {
          handleStopStream();
        }
      }}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom="10px">Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleCreatePost}>
            <Textarea
              placeholder="What' your job?"
              size="sm"
              resize={"none"}
              border="none"
              padding="0"
              minH="150px"
              value={content}
              onChange={handleContentChange}
              _focusVisible={{
                border: "none",
              }}
            />

            <div className="my-4 grid grid-cols-5 gap-2">
              {images?.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-gray-500 min-h-[100px]"
                >
                  {img?.camera ? (
                    <ImageShow src={img?.camera} />
                  ) : img?.url ? (
                    <>
                      {img?.url?.match(/video/i) ? (
                        <VideoShow src={img?.url} />
                      ) : (
                        <ImageShow src={img?.url} />
                      )}
                    </>
                  ) : (
                    <>
                      {img?.type?.match(/video/i) ? (
                        <VideoShow src={URL.createObjectURL(img) || img} />
                      ) : (
                        <ImageShow src={URL.createObjectURL(img) || img} />
                      )}
                    </>
                  )}
                  <span
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-[7px] right-2 text-2xl cursor-pointer"
                  >
                    &times;
                  </span>
                </div>
              ))}
            </div>

            {stream && (
              <div className="relative">
                <video
                  autoPlay
                  muted
                  ref={videoRef}
                  width="100%"
                  height="100%"
                />

                <span
                  className="absolute top-1 right-2 text-2xl cursor-pointer"
                  onClick={handleStopStream}
                >
                  &times;
                </span>
                <canvas ref={refCanvas} style={{ display: "none" }} />
              </div>
            )}
            <div className="flex items-center justify-center mt-3">
              {stream ? (
                <div className="cursor-pointer" onClick={handleCapture}>
                  <CameraIcon />
                </div>
              ) : (
                <>
                  <div className="cursor-pointer" onClick={handleStream}>
                    <CameraIcon />
                  </div>
                  <div className="cursor-pointer relative ml-4">
                    <ImageIcon className="cursor-pointer" />
                    <input
                      type="file"
                      name="file"
                      id="file"
                      multiple
                      accept="image/*,video/*"
                      className="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
                      onChange={handleChangeImages}
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              colorScheme={"green"}
              w="100%"
              mt="8px"
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreatePost;
