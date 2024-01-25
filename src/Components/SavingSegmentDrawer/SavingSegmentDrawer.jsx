import React, { useState } from "react";
import "./SavingSegmentDrawer.scss";
import { Button, Drawer, Input, Select, Space } from "antd";
import { schemas } from "../../segmentConstant";
import { AppstoreAddOutlined } from "@ant-design/icons";
import axios from "axios";

const INITIAL_STATE = {
  segment_name: "",
  schema: [],
}

const SavingSegmentDrawer = ({
  saveSegmentDrawerOpen,
  setSaveSegmentDrawerOpen,
}) => {
  // end value
  const [segmentDetails, setSegmentDetails] = useState(INITIAL_STATE);
  // add new schema option
  const [addSchemaSegment, setAddSchemaSegment] = useState("");

  // blue box dropdown list
  const [selectedSchemaList, setSelectedSchemaList] = useState([]);

  // options
  const [dropdownOption, setDropdownOption] = useState([]);

  const segmentDetailChange = (value, field) => {
    if (field === "segment_name") {
      setSegmentDetails({ ...segmentDetails, segment_name: value });
    } else if (field === "schema") {
      setSegmentDetails({
        ...segmentDetails,
        schema: [...segmentDetails.schema],
      });
    }
  };

  const handleAddNewSchema = () => {
    // add value in selectedSchemaList
    const selectedSchema = schemas.filter(
      (val) => val.Value === addSchemaSegment
    );

    setSelectedSchemaList([...selectedSchemaList, ...selectedSchema]);
    setAddSchemaSegment("");

    // remove selected schema form dropdown options
    if (selectedSchemaList.length > 0) {
      let res = [];
      const tempSelectedSchemaValues = (
        [...selectedSchemaList, ...selectedSchema] || []
      ).map((val) => val.Value);
      schemas.forEach((val) => {
        if (!tempSelectedSchemaValues.includes(val.Value)) {
          res.push(val);
        }
      });
      setDropdownOption(res);
    } else {
      const selectedSchema = schemas.filter(
        (val) => val.Value !== addSchemaSegment
      );
      setDropdownOption(selectedSchema);
    }
  };

  const handleSelectedDropdownChange = (newValue, preValue) => {
    // value and label change in selectedSchemaList
    const selectedSchema = schemas.filter((val) => val.Value === newValue);
    // preValue remove
    const removedArr = selectedSchemaList.filter(
      (val) => val.Value !== preValue.Value
    );
    setSelectedSchemaList([...removedArr, ...selectedSchema]);
    // add preValue to the dropdownOption
    const filteredSchema = dropdownOption.filter(
      (val) => val.Value !== newValue
    );
    setDropdownOption([...filteredSchema, preValue]);
  };

  const handleSaveSegment = () => {
    const outPut = {
      segment_name: segmentDetails.segment_name,
      schema: selectedSchemaList,
    };
    sendToWebhook(outPut);
  };

  const sendToWebhook = async (outPut) => {
    const webhookUrl = 'https://webhook.site/7a376035-a5d3-4085-990d-61f8bcb0360e'; 

    // Data to be sent to the server
    try {
      const result = await axios.post(webhookUrl, outPut);
      console.log('Response from server:', result);
      setSelectedSchemaList([]);
      setDropdownOption([]);
      setSegmentDetails(INITIAL_STATE);
      saveSegmentDrawerOpen(false);
    } catch (error) {
      console.error('Error sending data to server:', error.message);
    }
  };

  return (
    <div className="saving_segment_drawer">
      <Drawer
        title="Saving segment"
        placement="right"
        width={500}
        onClose={() => setSaveSegmentDrawerOpen(false)}
        open={saveSegmentDrawerOpen}
        footer={
          <Space>
            <Button type="primary" onClick={() => handleSaveSegment()} disabled={selectedSchemaList.length>0 ? false:true}>
              Save the segment
            </Button>
            <Button onClick={() => setSaveSegmentDrawerOpen(false)}>
              Cancel
            </Button>
          </Space>
        }
      >
        <span className="label">Enter the Name of the Segment</span>
        <Input
          placeholder="Name of the segment"
          value={segmentDetails.segment_name}
          onChange={(e) => segmentDetailChange(e.target.value, "segment_name")}
        />
        <span className="label">
          To save your segment, you need to add the schemas to build the query
        </span>
        <div className="dotcolor_info">
          <div class="dot-green"></div> - User Traits
          <div class="dot-red"></div> - Group Traits
        </div>
        {selectedSchemaList.length > 0 ? (
          <div className="selected_schemas">
            {selectedSchemaList.map((val) => (
              <Select
                key={val.Value}
                style={{ width: "100%" }}
                onChange={(value) => handleSelectedDropdownChange(value, val)}
                value={val.Value}
                options={
                  (dropdownOption || []).map((val) => {
                    return {
                      value: val.Value,
                      label: `${val.Label}`,
                    };
                  }) || []
                }
              />
            ))}
          </div>
        ) : (
          ""
        )}
        <Select
          style={{ width: "100%" }}
          placeholder="Add schema to segment"
          onChange={(value) => setAddSchemaSegment(value)}
          value={addSchemaSegment}
          options={
            (dropdownOption.length > 0 ? dropdownOption : schemas).map(
              (val) => {
                return {
                  value: val.Value,
                  label: `${val.Label}`,
                };
              }
            ) || []
          }
        />
        <Button
          icon={<AppstoreAddOutlined />}
          onClick={() => handleAddNewSchema()}
        >
          Add new schema
        </Button>
      </Drawer>
    </div>
  );
};

export default SavingSegmentDrawer;
