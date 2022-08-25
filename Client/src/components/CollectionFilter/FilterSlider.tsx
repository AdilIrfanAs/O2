import * as React from "react";
import { Range, getTrackBackground } from "react-range";
import "./CollectionFilter.css"
const STEP = 1;
let MIN = 0;
let MAX = 100;

// Copy of TwoThumbs with `draggableTrack` prop added
const FilterSlider: React.FC<{ rtl: boolean; MinMax: any; Value: any }> = ({
  rtl,
  MinMax,
  Value,
}) => {
  const [values, setValues] = React.useState([0, 100]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        draggableTrack
        values={Value}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={rtl}
        onChange={(values) => {
          setValues(values);
          MinMax(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "30px",
              display: "flex",
              width: "100%",
              marginBottom: "19px",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "4px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ['#55412D', '#DECD9F', '#55412D'],
                  min: MIN,
                  max: MAX,
                  rtl
                }),
                // background: "#DECD9F",
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props, isDragged }) => (
          <div className="range-thumb"
            {...props}
            style={{
              ...props.style,
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              // backgroundImage: "url(../../assets/images/range-slider.svg)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <div
              style={{
                position: 'absolute',
                top: '-28px',
                color: '#fff',
                fontWeight: 'bold',
                // fontSize: '14px',
                // fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: '#DECD9F'
              }}
            >
              {values[index].toFixed(1)}
            </div> */}
            {/* <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: isDragged ? '#DECD9F' : '#CCC'
              }}
            /> */}
          </div>
        )}
      />
    </div>
  );
};

export default FilterSlider;
