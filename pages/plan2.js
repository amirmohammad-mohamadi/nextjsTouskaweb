import { Fragment, useState } from "react";
import { Col, Form } from "react-bootstrap";

import Button from "../components/ui/Button";

import classes from "../styles/plans.module.css";
import axios from "axios";
import { ConnectToDB } from "../lib/connect-to-db";
import PlansStep2 from "../components/plans/front/PlansStep2";
import Head from "next/head";

const Plans = (props) => {
  const [catDetails, setCatDetails] = useState(props.valCats.cats);
  const [itemDetails, setItemDetails] = useState({ status: "nothing" });

  const [valueBox, setValueBox] = useState("Open this select menu");
  const [typeValue, setTypeValue] = useState();

  const [step1, setStep1] = useState(true);

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);

    setTypeValue(+val[0]);
  };

  const categories = catDetails.filter(
    (item) => item.name !== "پایه" && item.name !== "پیشنهادی"
  );

  const backStep1Handler = () => {
    setStep1(true);
  };

  const submitHandler = () => {
    const connectDB = ConnectToDB("get/semiplan/panel");

    const fData = new FormData();

    fData.append("category_id", typeValue);

    axios({
      method: "POST",
      url: connectDB,
      data: fData,
    })
      .then((res) => {
        if (res.data.status === "success") {
          setItemDetails(res.data);
          setStep1(false);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
  };

  return (
    <Fragment>
      <Head>
        <title>پلن سایت نیمه اختصاصی توسکاوب</title>
        <meta
          name="description"
          content="پلن سایت نیمه اختصاصی شرکت توسکاوب بر پایه نیازهای سایت مشتری"
        />
        <meta name="keywords" content="قیمت طراحی سایت نیمه اختصاصی" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="توسعه محتوا وب توسکا" />
      </Head>

      <section className={`${classes.plans} whiteSec`}>
        <h1 className="text-center mb-5">پلن سایت نیمه اختصاصی شرکت توسکاوب</h1>
        {step1 && (
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.selectCategory}
          >
            <Form.Label className={classes.labelSelect}>
              نوع سایت را انتخاب کنید؟
            </Form.Label>
            <Form.Select
              value={valueBox}
              onChange={changeHandler}
              aria-label="Default select example"
            >
              <option>انتخاب پلن ...</option>
              {categories.map((box) => (
                <option key={box.id} value={`${box.id}.${box.name}`}>
                  {box.name}
                </option>
              ))}
            </Form.Select>
            <div className={classes.actions}>
              <Button onClick={submitHandler}>مرحله بعد</Button>
            </div>
          </Form.Group>
        )}
        {itemDetails.status === "success" && !step1 && (
          <PlansStep2 value={itemDetails} backStep1={backStep1Handler} />
        )}
      </section>
    </Fragment>
  );
};

export const getServerSideProps = async (context) => {
  const response = await fetch(
    `https://api.tooskaweb.com/api/get/semiplan/cat`
  );
  const valCats = await response.json();

  return {
    props: {
      valCats,
    },
  };
};

export default Plans;
