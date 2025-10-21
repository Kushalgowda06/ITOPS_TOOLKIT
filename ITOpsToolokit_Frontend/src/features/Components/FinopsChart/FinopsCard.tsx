import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const FinopsCard = (props) => {
  return (
    <>
      <Card  className="border-5 border-success border-start  border-primary">
        <CardActionArea>
          <CardContent className="p-2">
          <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <span className="fw-bold text-primary  fontsize" style={{
                background:
                  " linear-gradient(361deg, #FC466B 0%, #3F5EFB 100%)",
                  WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "block",
              }}>
              {props.title}
            </span>
            <Typography
              variant="inherit"
              className="test"
              sx={{
                fontWeight: "bold",
                background:
                  "linear-gradient(152deg, rgba(176, 33, 211, 1) 2%, rgba(126, 132, 212, 1) 55%, rgba(31, 51, 195, 1) 97%);",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "block",
              }}
            >
              {props.count}
            </Typography>
            </div>
            {/* <div className="ml-auto">
              <span className="text-primary fs-2">
                {props.icon}
              </span>
              </div> */}
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
export default FinopsCard;
