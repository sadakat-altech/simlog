import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import JobList from "./JobList";
import { formatDate } from "../../services/CommonUtils";

const JobDetails = () => {
  const { id } = useParams();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/logs`)
      .then((res) => res.json())
      .then((data) => {
        setlogOptions(data.logList);
      });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sources`)
      .then((res) => res.json())
      .then((data) => {
        setSourceOptions(data.sourceList);
      });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors`)
      .then((res) => res.json())
      .then((data) => {
        setCollectorOptions(data.collectorList);
      });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobList(data.jobList);
      });
    if (id != 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs/view/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setJob(data.job);
        });
    } else {
      resetForm();
    }
  }, [id]);

  const [job, setJob] = useState({
    jobName: "",
    logId: "",
    duration: "",
    volume: "",
    date: "",
    time: "",
    sourceId: "",
    collectorId: "",
  });
  const [logOptions, setlogOptions] = useState("");
  const [sourceOptions, setSourceOptions] = useState("");
  const [collectorOptions, setCollectorOptions] = useState("");
  const [message, setMessage] = useState({ color: null, text: null });
  const [isLoading, setIsLoading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();

  const handleOnChange = (prop, value) => {
    setJob((prevState) => ({ ...prevState, [prop]: value }));
  };

  const handleOnSelect = (prop, value) => {
    if (value === 0) {
      setJob((prevState) => ({ ...prevState, [prop]: null }));
    } else {
      setJob((prevState) => ({ ...prevState, [prop]: value }));
    }
  };

  const createLogOptions = () => {
    if (logOptions) {
      return logOptions.map((ele) => (
        <option selected={ele._id === job.logId} key={ele._id} value={ele._id}>
          {ele.logName}
        </option>
      ));
    }
  };

  const createSourceOptions = () => {
    if (sourceOptions) {
      return sourceOptions.map((ele) => (
        <option
          key={ele._id}
          selected={ele._id === job.sourceId}
          value={ele._id}
        >
          {ele.sourceName + " -> " + ele.fromIP + " - " + ele.toIP}
        </option>
      ));
    }
  };

  const createCollectorOptions = () => {
    if (collectorOptions) {
      return collectorOptions.map((ele) => (
        <option
          key={ele._id}
          selected={ele._id === job.collectorId}
          value={ele._id}
        >
          {ele.collectorName +
            " -> " +
            ele.collectorIP +
            ":" +
            ele.collectorPort}
        </option>
      ));
    }
  };

  const saveJob = () => {
    if (validateForm()) {
      setIsLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      };

      if (job._id) {
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/jobs/update`,
          requestOptions
        )
          .then((res) => res.json())
          .then((data) => handleData(data));
      } else {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs/save`, requestOptions)
          .then((res) => res.json())
          .then((data) => handleData(data));
      }
    }
  };

  const handleData = (data) => {
    if (data.job) {
      setMessage((prev) => {
        prev.color = "green";
        prev.text = data.message;
        return prev;
      });
      fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs`)
        .then((res) => res.json())
        .then((data) => {
          setJobList(data.jobList);
        });
      resetForm();
    } else {
      setMessage((prev) => {
        prev.color = "red";
        prev.text = data.message;
        return prev;
      });
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setJob({
      jobName: "",
      logId: "",
      duration: "",
      volume: "",
      date: "",
      time: "",
      sourceId: "",
      collectorId: "",
    });
    navigate("/jobs/0");
  };

  const validateForm = () => {
    const date = Date.now();
    const selectedDate = new Date(job.date);
    if (!job.jobName.trim()) {
      setMessage({ color: "red", text: "Enter Job Name" });
      return false;
    }
    if (!job.logId || job.logId == 0) {
      setMessage({ color: "red", text: "Select a log" });
      return false;
    }
    if (!job.duration || !Number(job.duration) || job.duration < 0) {
      setMessage({ color: "red", text: "Invalid duration" });
      return false;
    }
    if (!job.volume || !Number(job.volume) || job.volume < 0) {
      setMessage({ color: "red", text: "Invalid volume" });
      return false;
    }
    if (selectedDate < date) {
      setMessage({ color: "red", text: "Invalid date" });
      return false;
    }
    if (!job.sourceId || job.sourceId == 0) {
      setMessage({ color: "red", text: "Select a Source IP range" });
      return false;
    }
    if (!job.collectorId || job.collectorId == 0) {
      setMessage({ color: "red", text: "Select a Collector IP" });
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <h2 className="text-center"> Create New Jobs </h2>
      <div className="container jobdetails">
			<div className="row align-items-center">
				<div className="row col-md-5">
					<div className="col-md-4">
					<label> Job Name </label>
					</div>
					<div className="col-md-4">
					<label> Log Source Name </label>
					<br />
					</div>
					<div className="col-md-4">
					<label> Duration(in Mins) </label>
					</div>
				</div>
				<div className="row col-md-7">
					<div className="col-md-1">
					<label> Volume(MB) </label>
					</div>
					<div className="col-md-3">
					<label>Source IP</label>
					</div>
					<div className="col-md-3">
					<label>Collector IP</label>
					</div>
					<div className="col-md-2">
					<label> Date & Time </label>
					</div>
				</div>
				<div className="row col-md-5">
					<div className="col-md-4">
					<input
						type="text"
						name="name"
						value={job.jobName}
						onChange={(e) => handleOnChange("jobName", e.target.value)}
						className="form-control"
						placeholder="Enter Job Name"
						disabled={job._id}
					/>
					</div>
					<div className="col-md-4">
					<select
						className="form-select"
						name="logSourceId"
						onChange={(e) => handleOnSelect("logId", e.target.value)}
					>
						<option value={0}>-- Select Log Type --</option>
						{logOptions && createLogOptions()}
					</select>
					</div>

					<div className="col-md-4">
					<input
						type="text"
						name="duration"
						value={job.duration}
						onChange={(e) => handleOnChange("duration", e.target.value)}
						className="form-control"
						placeholder="Enter Duration"
					/>
					</div>
				</div>
				<div className="row col-md-7">
					<div className="col-md-1">
					<input
						type="text"
						name="volume"
						value={job.volume}
						onChange={(e) => handleOnChange("volume", e.target.value)}
						className="form-control"
						placeholder="Enter Volume"
					/>
					</div>

					<div className=" col-md-3">
					<select
						className="form-select"
						onChange={(e) => handleOnSelect("sourceId", e.target.value)}
					>
						<option value={0}>-- Select Source --</option>
						{sourceOptions && createSourceOptions()}
					</select>
					</div>
					<div className="col-md-3 ">
					<select
						className="form-select"
						onChange={(e) => {
						handleOnSelect("collectorId", e.target.value);
						}}
					>
						<option value={0}>-- Select Collector --</option>
						{collectorOptions && createCollectorOptions()}
					</select>
					</div>
					<div className="col-md-2">
					<input
						name="scheculedDate"
						type="datetime-local"
						className="form-control"
						value={formatDate(new Date(job.date))}
						onChange={(e) => handleOnChange("date", e.target.value)}
					/>
					</div>
				</div>		
					<div className="flex-container">
					<div Class="submitbutton">
						<button className="btn btn-primary" onClick={saveJob}>
						Submit
						</button>
					</div>
					<div className="backbutton">
						<button
						className="btn btn-outline-warning"
						onClick={() => {
							resetForm();
							navigate("/jobs/0");
						}}
						>
						Cancel
						</button>
					</div>
					</div>
           			 {message.text && (
              		<div style={{ color: message.color }}>{message.text}</div>
            		)}
          		
        	</div>
		</div>
        <JobList jobList={jobList} />
	</div>
    
  );
};

export default JobDetails;
