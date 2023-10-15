

function questionKindChange(option) {
  optionList = document.getElementsByClassName(option.id)[0];
  if (option.value === "Radio" || option.value === "Checkbox") {
    optionList.classList.remove("visually-hidden");
  } else {
    optionList.classList.add("visually-hidden");
  }
}


const randomPassword = () => {
  let password = document.getElementById("userPassword");
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    ".*-!#$&*@" +
    "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 1; i <= 10; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }
  password.value = pass;
};

const registerRoleChange = () => {
  let roleSelect = document.getElementById("roleSelect");
  let studentForm = document.getElementById("studentGroup");
  let teacherForm = document.getElementById("teacherGroup");

  if (roleSelect.value === "Student") {
    teacherForm.classList.add("visually-hidden");
    studentForm.classList.remove("visually-hidden");
  } else if (roleSelect.value === "Teacher") {
    studentForm.classList.add("visually-hidden");
    teacherForm.classList.remove("visually-hidden");
  } else {
    studentForm.classList.add("visually-hidden");
    teacherForm.classList.add("visually-hidden");
  }
};
