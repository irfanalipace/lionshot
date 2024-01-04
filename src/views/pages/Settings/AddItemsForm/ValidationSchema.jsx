import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  type: Yup.string().required(),
  name: Yup.string()
    .required()
    .max(55, "Name must be less than 255 characters"),
  sku: Yup.string().required().max(50, "sku must be less than 255 characters"),
  // unit: Yup.string().when("type", {
  //   is: "goods",
  //   then: () => Yup.string().required("Unit is required for goods type"),
  //   otherwise: () => Yup.string().notRequired(),
  // }),
  is_sales_info: Yup.boolean(),
  sale_info: Yup.object().when("is_sales_info", {
    is: true,
    then: () =>
      Yup.object().shape({
        s_selling_price: Yup.number()
          .typeError("Selling price must be a number")
          .required("price is required"),
        // .max(255, "Selling price must be less than 255 characters "),
        s_account_id: Yup.string().required("Account for sales is required"),
        s_description: Yup.string().max(
          255,
          "Description must not exceed 255 characters"
        ),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
  is_purchase_info: Yup.boolean(),
  purchase_info: Yup.object().when("is_purchase_info", {
    is: true,
    then: () =>
      Yup.object().shape({
        p_selling_price: Yup.number()
          .typeError("price must be a number")
          .required("Cost price is required"),
        // .max(255, "Cost price must be less than 255 characters "),
        p_account_id: Yup.string().required("Account for purchase is required"),
        p_description: Yup.string().max(
          255,
          "Description must not exceed 255 characters"
        ),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
  tax_preference: Yup.string().required("Tax preference is required"),
  exemption_reason: Yup.string().when("tax_preference", {
    is: "non-taxable",
    then: () =>
      Yup.string().required(
        "Exemption reason is required for non-taxable items"
      ),
    otherwise: () => Yup.string().notRequired(),
  }),
  is_track_inventory: Yup.boolean(),
  inventory_info: Yup.object().when("is_track_inventory", {
    is: true,
    then: () =>
      Yup.object().shape({
        inventory_account: Yup.string().required(
          "Inventory account is required when tracking inventory"
        ),
        opening_stock: Yup.number()
          .typeError("opening stock must be a number")
          .required("Opening Stock is required"),
        // .max(255, "Opening stock must be less than 255 characters "),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
});

export default validationSchema;
