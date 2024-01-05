import { useEffect } from "react";
import { generateNumberApi } from "../../../core/api/estimate";

export const useGenerateNumber = (type, number, formik, edit, id) => {
  useEffect(() => {
    if (!edit && !id) {
      const fetchNumber = async () => {
        try {
          const resp = await generateNumberApi({ type: type });
          formik.setFieldValue(number, resp?.data[0]);
        } catch (error) {
          // Handle error
        }
      };

      fetchNumber();
    }
  }, [type]);
};
