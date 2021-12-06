const { check_auth } = require("./../../Services/Auth");

const CourseService = require("./../../Services/CourseService");
const UniService = require("./../../Services/UniService");
const UserService = require("./../../Services/UserService");

/**
 * @param {*} req
 * @param {*} res
 * @returns {[{course}]}
 */
exports.get_all_courses = async (req, res) => {
  res.json(await CourseService.get_all_courses());
};

/**
 *
 * @param {params:{courseId}} req
 * @param {*} res
 * @returns {[{course}]}
 */
exports.get_course_by_id = async (req, res) => {
  res.json(await CourseService.get_course_by_id(req.params.courseId));
};

/**
 *
 * @param {body: {courseName, uniId}} req
 * @param {*} res
 * @returns {[{course}]}
 */
exports.create_course = async (req, res) => {
  try {
    const user = await check_auth(req);
    const { courseName, uniId } = req.body;

    if (!(courseName && uniId))
      throw new Error("Please include courseName and uniId in req.body");

    const addedCourse = await CourseService.create_course(courseName, uniId);
    const uni = await UniService.get_uni_by_id(uniId);
    const addToUni = await UniService.update_uni_arr_by_uni_id(
      uni,
      "add",
      "uniCourses",
      addedCourse.course._id
    );

    if (addedCourse.dbSaveError) throw new Error(dbSaveError);

    res.json([addedCourse]);
  } catch (err) {
    res.send([{ error: err.message }]);
  }
  return 0;
};

/**
 *
 * @param {body: { documentId, updateObj: { courseName, courseUni }}} req
 * @param {*} res
 * @returns {[{course}]}
 */
exports.update_course_scalar = async (req, res) => {
  try {
    //FIXME there needs to be a createdBy field for all the db we have, so that only the one who created it can edit it, or an admin user
    const user = await check_auth(req);
    const { documentId, updateObject } = JSON.parse(req.body);

    if (!(documentId && updateObject))
      throw new Error(
        "Please provide a documentId for the Uni and an updateObject with relevant fields in req.body"
      );

    const queryResult = await CourseService.update_course_scalar_by_course_id(
      documentId,
      updateObject
    );

    if (!queryResult) throw new Error("No such Course");

    res.json([queryResult]);
  } catch (err) {
    res.send([{ error: err.message }]);
  }
};

/**
 *
 * @param {body: {documentId, type, fieldName, referenceId}} req
 * @param {*} res
 * @returns {[{course}]}
 */
exports.update_course_arr = async (req, res) => {
  try {
    const { documentId, type, fieldName, referenceId } = JSON.parse(req.body);
    if (!(documentId && type && fieldName && referenceId))
      throw new Error(
        "please include a documentId, type, fieldName, and referenceId in req.body"
      );

    const user = await check_auth(req);

    const course = await CourseService.get_course_by_id(documentId);

    const queryResult = await CourseService.update_course_arr_by_course_id(
      course,
      type,
      fieldName,
      referenceId
    );

    if (!queryResult) throw new Error("No such Course");

    res.json([queryResult]);
  } catch (err) {
    res.send([{ error: err.message }]);
  }
};

/**
 *
 * @param {body: {documentId, type}} req
 * @param {*} res
 */
exports.update_user_subscription = async (req, res) => {
  try {
    const { documentId, type } = JSON.parse(req.body);
    if (!(documentId && type))
      throw new Error("please include a documentId, type in req.body");

    const user = await check_auth(req);

    const addCourseToUser =
      await UserService.update_user_arr_by_email_or_username(
        user.email,
        user,
        type,
        "subscribed",
        documentId
      );

    const course = await CourseService.get_course_by_id(documentId);

    const queryResult = await CourseService.update_course_arr_by_course_id(
      course,
      type,
      "subscribed",
      user._id
    );

    if (!queryResult) throw new Error("No such Course");

    res.json([queryResult]);
  } catch (err) {
    res.send([{ error: err.message }]);
  }
};
