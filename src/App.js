import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  faPlay,
  faBackwardStep,
  faForwardStep,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import "./reset.css";

import data from "./Data";
import { useEffect } from "react";
import { useRef } from "react";

function App() {
  const [list, setList] = useState(data);

  let [isClick, setClick] = useState(0);
  let [isImg, setImg] = useState(0);

  let [play, setPlay] = useState(false);
  const playRef = useRef(null);
  let totalRef = useRef(null);
  let currentRef = useRef(null);
  let progressRef = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (play) playAudio();
    else stopAudio();
  }, [play, isClick]);

  function prevSong() {
    //이전
    if (isClick < 1) {
      setClick(list.length - 1);
      return;
    }
    setClick((state) => state - 1);
    // setImg((state) => state - 1);
    // setPlay(true);
  }
  function nextSong() {
    //다음
    if (isClick > list.length - 2) {
      setClick(0);
      return;
    }
    setClick((state) => state + 1);
    // setImg((state) => state + 1);

    // setPlay(true);
  }

  function playAudio() {
    //재생
    setValue(0);
    playRef.current.play();
    setPlay(true);
    timeUpdate();
  }
  function stopAudio() {
    //정지
    playRef.current.pause();
    setPlay(false);
  }

  function timeUpdate() {
    //재생바
    playRef.current.addEventListener("timeupdate", () => {
      totalRef.current.innerHTML = playRef.current.duration;
      currentRef.current.innerHTML = playRef.current.currentTime;
      progressRef.current.value = playRef.current.currentTime;
      progressRef.current.max = playRef.current.duration;
      if (playRef.current.currentTime === playRef.current.duration) {
        console.log("같노");
        setClick((state) => state + 1);
      }
    });
  }
  const handleChange = (result) => {
    if (!result.destination) return;
    const items = [...list]; // 새배열담기
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
    setClick(result.destination.index);
    console.log(result, "드래그결과");
  };

  return (
    <div className="App">
      <div>
        <span id="current" ref={currentRef}></span> /{" "}
        <span id="total" ref={totalRef}></span>
      </div>

      <div className="music_con">
        <audio
          id="myAudio"
          src={`music/item_${list[isClick].id}.mp3`}
          ref={playRef}
        />
        <div className="top_con">
          <div className="close"></div>
          <p className="title">재생목록</p>
        </div>
        <div className="nav_con">
          <p>곡</p>
          <p>플레이리스트</p>
          <p>타임머신</p>
        </div>

        <DragDropContext onDragEnd={handleChange}>
          <Droppable droppableId="list">
            {(provided) => (
              <div
                className="list list_con"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {list.map(({ id, 제목, 가수, subName, 시간 }, index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        key={id}
                      >
                        <div
                          className={
                            isClick == index ? "click music_box" : "music_box"
                          }
                          key={id}
                          onClick={(e) => {
                            console.log(index, "클릭한거");
                            setClick(index);
                            setPlay(true);
                          }}
                        >
                          <div className="music_img ">
                            <div
                              className={
                                isClick == index && play ? "play_icon" : "none"
                              }
                            >
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                            </div>
                            <img
                              src={"img/item_" + Number(id) + ".jpg"}
                              width="100%"
                              alt=""
                            />
                          </div>
                          <div className="music_text">
                            <div>
                              <p className="name">{제목}</p>
                              <p className="text">
                                <span>{가수}</span>
                                <span>{subName}</span>
                              </p>
                            </div>
                            <p className="text time">{시간}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="footer">
        <div className="progressbar_con">
          <input
            type="range"
            id="progress"
            value={value}
            ref={progressRef}
            className={play == false ? "play__range" : "opacity play__range"}
            onChange={(e) => {
              playRef.current.currentTime = e.target.value;
              playAudio();
              setValue(playRef.current.currentTime);
            }}
          />
        </div>

        <div className="play_con">
          <div
            className="music_detail"
            style={{ background: "url(detail.png)center no-repeat" }}
          ></div>
          <FontAwesomeIcon
            icon={faBackwardStep}
            className="faPrev"
            onClick={prevSong}
          />

          <div>
            {play == false ? (
              <FontAwesomeIcon
                icon={faPlay}
                className="faPlay"
                onClick={playAudio}
              />
            ) : (
              <FontAwesomeIcon
                icon={faPause}
                className="faStop"
                onClick={stopAudio}
              />
            )}
          </div>

          <FontAwesomeIcon
            icon={faForwardStep}
            className="faNext"
            onClick={nextSong}
          />
          <div className="music_img_con">
            <img src={`img/item_${list[isClick].id}.jpg`} width="100%" alt="" />
            {/* 썸네일 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
