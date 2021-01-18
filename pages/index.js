import styles from "../styles/Home.module.scss";
import { useState, useRef, useEffect } from "react";

const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [isText, setText] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [errorText, setErrorText] = useState("");
  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case "isEmpty":
          if (value) {
            setEmpty(false);
          } else {
            setEmpty(true);
            setErrorText("Поле не может быть пустым");
          }
          break;
        case "isText":
          const regExpText = /^[а-яА-ЯёЁa-zA-Z]+$/;
          if (regExpText.test(value)) {
            setText(true);
          } else {
            setText(false);
            setErrorText("В имени могут быть только буквы");
          }
          break;
        case "isEmail":
          const regExpMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (regExpMail.test(String(value).toLowerCase())) {
            setEmailError(false);
          } else {
            setEmailError(true);
            setErrorText("Введите корректный email");
          }
          break;
        case "isURL":
          const regExpURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
          if (regExpURL.test(String(value).toLowerCase())) {
            setUrlError(false);
          } else {
            setUrlError(true);
            setErrorText("Некорректный URL");
          }
          break;
      }
    }
  }, [validations, value]);
  return {
    errorText,
    isEmpty,
    isText,
    emailError,
    urlError,
  };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isWrong, setWrong] = useState(false);
  const valid = useValidation(value, validations);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = (e) => {
    setWrong(true);
  };

  const wrongHandler = () => {
    setWrong((prev) => !prev);
  };

  return {
    value,
    setValue,
    onChange,
    onBlur,
    isWrong,
    wrongHandler,
    ...valid,
  };
};

const useCheckbox = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [isWrong, setWrong] = useState(false);
  const onChange = (e) => {
    setValue(e.target.checked);
  };
  const onBlur = (e) => {
    setWrong(true);
  };
  const wrongHandler = () => {
    setWrong((prev) => !prev);
  };

  return {
    value,
    onChange,
    onBlur,
    isWrong,
    setValue,
    wrongHandler,
  };
};

export default function Home() {
  //* States
  const firstName = useInput("", { isText: false, isEmpty: true });
  const lastName = useInput("", { isText: false, isEmpty: true });
  const email = useInput("", { isEmail: false, isEmpty: true });
  const sex = useInput("", { isEmpty: true });
  const github = useInput("", { isURL: false, isEmpty: true });
  const [filename, setFilename] = useState("");
  const checked = useCheckbox(false);
  //! errors state
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [githubError, setGithubError] = useState("");
  //! buttons state
  const [buttonStatus, setButtonStatus] = useState(true);
  const [togglePolicies, setTogglePolicies] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  //* States end

  //* Refs
  const fileElem = useRef("");
  //* Refs end

  //* Handlers
  const fileHandler = () => {
    if (fileElem.current.files.length) {
      setFilename(fileElem.current.files[0].name);
    }
  };
  const resetFileHandler = () => {
    setFilename("");
    return false;
  };

  const togglePoliciesHandler = (e, action) => {
    e.preventDefault();
    setTogglePolicies((prev) => !prev);
    if (action === "accept") {
      checked.setValue(true);
    }
  };
  const toggleAlertHandler = (e) => {
    e.preventDefault();
    if (buttonStatus) {
      let fields = [firstName, lastName, email, sex, checked];
      for (let field of fields) {
        if (!field.isWrong) {
          field.wrongHandler();
        }
      }
    } else {
      setToggleAlert((prev) => !prev);
    }
  };
  //* Handlers end

  //* Effects
  useEffect(() => {
    const buttonStatusHandler = () => {
      if (
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        !email.isEmpty &&
        !sex.isEmpty &&
        checked.value &&
        firstName.isText &&
        lastName.isText &&
        !email.emailError
      ) {
        setButtonStatus(false);
      } else {
        setButtonStatus(true);
      }
    };
    buttonStatusHandler();
  }, [firstName, lastName, email, checked.value]);
  useEffect(() => {
    if (!toggleAlert) {
      resetFileHandler();
      checked.setValue(false);
      if (checked.value) {
        checked.wrongHandler();
      }
      let fields = [firstName, lastName, email, github];
      for (let field of fields) {
        field.setValue("");
        if (field.isWrong) {
          field.wrongHandler();
        }
      }
    }
  }, [toggleAlert]);
  useEffect(() => {
    if (
      (firstName.isWrong && firstName.isEmpty) ||
      (!firstName.isEmpty && firstName.isWrong && !firstName.isText)
    ) {
      setFirstnameError("errorInput");
    } else {
      setFirstnameError("");
    }
    if (
      (lastName.isWrong && lastName.isEmpty) ||
      (!lastName.isEmpty && lastName.isWrong && !lastName.isText)
    ) {
      setLastnameError("errorInput");
    } else {
      setLastnameError("");
    }
    if (
      (email.isWrong && email.isEmpty) ||
      (!email.isEmpty && email.isWrong && email.emailError)
    ) {
      setEmailError("errorInput");
    } else {
      setEmailError("");
    }
    if (!github.isEmpty && github.urlError) {
      setGithubError("errorInput");
    } else {
      setGithubError("");
    }
  }, [firstName, lastName, email, github]);

  return (
    <>
      <PopUp
        type="thanks"
        firstname={firstName.value}
        onClose={toggleAlertHandler}
        active={toggleAlert}
      />
      <PopUp
        type="policies"
        onClose={togglePoliciesHandler}
        active={togglePolicies}
      />
      <div className={`${styles.form}`}>
        <h1>Анкета соискателя</h1>
        <div className={`${styles.form_data}`}>
          <h2>Личные данные</h2>
          <label
            className={`${styles.form_data_firstname} ${
              firstnameError ? styles.errorInput : ""
            }`}
          >
            <p>Имя *</p>
            {firstName.isWrong &&
              firstName.isEmpty &&
              errorElem(firstName.errorText)}
            {!firstName.isEmpty &&
              firstName.isWrong &&
              !firstName.isText &&
              errorElem(firstName.errorText)}
            <input
              type="text"
              name="firstname"
              value={firstName.value}
              onChange={(e) => firstName.onChange(e)}
              onBlur={(e) => firstName.onBlur(e)}
            ></input>
          </label>
          <label
            className={`${styles.form_data_lastname} ${
              lastnameError ? styles.errorInput : ""
            }`}
          >
            <p>Фамилия *</p>
            {lastName.isWrong &&
              lastName.isEmpty &&
              errorElem(lastName.errorText)}
            {!lastName.isEmpty &&
              lastName.isWrong &&
              !lastName.isText &&
              errorElem(lastName.errorText)}
            <input
              type="text"
              name="lastname"
              value={lastName.value}
              onChange={(e) => lastName.onChange(e)}
              onBlur={(e) => lastName.onBlur(e)}
            ></input>
          </label>
          <label
            className={`${styles.form_data_email} ${
              emailError ? styles.errorInput : ""
            }`}
          >
            <p>Электронная почта *</p>
            {email.isWrong && email.isEmpty && errorElem(email.errorText)}
            {!email.isEmpty &&
              email.isWrong &&
              email.emailError &&
              errorElem(email.errorText)}
            <input
              type="email"
              name="email"
              value={email.value}
              onChange={(e) => email.onChange(e)}
              onBlur={(e) => email.onBlur(e)}
            ></input>
          </label>
          <label className={`${styles.form_data_file}`}>
            <input
              ref={fileElem}
              type="file"
              name="file"
              onChange={() => fileHandler()}
            ></input>
            {!filename ? (
              <div className={`${styles.form_data_file_btn}`}>
                <div className={`${styles.form_data_file_btn_plus}`}>
                  <div className={`${styles.form_data_file_btn_plus_h}`}></div>
                  <div className={`${styles.form_data_file_btn_plus_v}`}></div>
                </div>
                <p>Загрузить резюме</p>
              </div>
            ) : (
              <div className={`${styles.form_data_file_filename}`}>
                <svg
                  className={`${styles.form_data_file_filename_clip}`}
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.1766 2.07168C8.70473 0.599805 6.30786 0.599805 4.83754 2.07168L0.75942 6.14668C0.732858 6.17324 0.718795 6.20918 0.718795 6.24668C0.718795 6.28418 0.732858 6.32012 0.75942 6.34668L1.33598 6.92324C1.36234 6.94948 1.39801 6.96421 1.4352 6.96421C1.47239 6.96421 1.50807 6.94948 1.53442 6.92324L5.61255 2.84824C6.11879 2.34199 6.79223 2.06387 7.50786 2.06387C8.22348 2.06387 8.89692 2.34199 9.40161 2.84824C9.90786 3.35449 10.186 4.02793 10.186 4.74199C10.186 5.45762 9.90786 6.12949 9.40161 6.63574L5.24536 10.7904L4.57192 11.4639C3.94223 12.0936 2.91879 12.0936 2.28911 11.4639C1.98442 11.1592 1.81723 10.7545 1.81723 10.3232C1.81723 9.89199 1.98442 9.4873 2.28911 9.18262L6.41255 5.06074C6.51723 4.95762 6.65473 4.8998 6.80161 4.8998H6.80317C6.95005 4.8998 7.08598 4.95762 7.18911 5.06074C7.29379 5.16543 7.35005 5.30293 7.35005 5.4498C7.35005 5.59512 7.29223 5.73262 7.18911 5.83574L3.81879 9.20293C3.79223 9.22949 3.77817 9.26543 3.77817 9.30293C3.77817 9.34043 3.79223 9.37637 3.81879 9.40293L4.39536 9.97949C4.42171 10.0057 4.45739 10.0205 4.49458 10.0205C4.53177 10.0205 4.56744 10.0057 4.5938 9.97949L7.96254 6.61074C8.27348 6.2998 8.4438 5.8873 8.4438 5.44824C8.4438 5.00918 8.27192 4.59512 7.96254 4.28574C7.32036 3.64355 6.27661 3.64512 5.63442 4.28574L5.23442 4.6873L1.51254 8.40762C1.25994 8.65874 1.0597 8.95752 0.923444 9.28663C0.787189 9.61573 0.717628 9.96861 0.718795 10.3248C0.718795 11.0482 1.00161 11.7279 1.51254 12.2389C2.04223 12.767 2.73598 13.0311 3.42973 13.0311C4.12348 13.0311 4.81723 12.767 5.34536 12.2389L10.1766 7.41074C10.8875 6.69824 11.2813 5.7498 11.2813 4.74199C11.2829 3.73262 10.8891 2.78418 10.1766 2.07168Z"
                    fill="#8C8C8C"
                  />
                </svg>
                {filename}
                <svg
                  className={`${styles.form_data_file_filename_remove}`}
                  onClick={(e) => resetFileHandler(e)}
                  width="10"
                  height="12"
                  viewBox="0 0 10 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.80912 6L9.91068 1.11094C9.97943 1.02969 9.92162 0.90625 9.81537 0.90625H8.56849C8.49506 0.90625 8.42474 0.939062 8.37631 0.995312L4.99349 5.02813L1.61068 0.995312C1.56381 0.939062 1.49349 0.90625 1.41849 0.90625H0.171619C0.0653688 0.90625 0.00755619 1.02969 0.0763062 1.11094L4.17787 6L0.0763062 10.8891C0.0609056 10.9072 0.0510255 10.9293 0.0478385 10.9529C0.0446516 10.9764 0.0482917 11.0004 0.058327 11.022C0.0683624 11.0435 0.0843714 11.0617 0.104453 11.0745C0.124535 11.0872 0.147846 11.0939 0.171619 11.0938H1.41849C1.49193 11.0938 1.56224 11.0609 1.61068 11.0047L4.99349 6.97188L8.37631 11.0047C8.42318 11.0609 8.49349 11.0938 8.56849 11.0938H9.81537C9.92162 11.0938 9.97943 10.9703 9.91068 10.8891L5.80912 6Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </div>
            )}
          </label>
          <div className={`${styles.form_data_sex}`}>
            <div className={`${styles.form_data_sex_title}`}>
              {sex.isWrong && sex.isEmpty && errorElem("Укажите пол")}
              <h2>Пол *</h2>
            </div>
            <label className={`${styles.form_data_sex_male}`}>
              <input
                type="radio"
                name="sex"
                value="Male"
                onChange={sex.onChange}
              ></input>
              Мужской
            </label>
            <label className={`${styles.form_data_sex_female}`}>
              <input
                type="radio"
                name="sex"
                value="Female"
                onChange={sex.onChange}
              ></input>
              Женский
            </label>
          </div>
          <div
            className={`${styles.form_data_git} ${
              githubError ? styles.errorInput : ""
            }`}
          >
            <div className={`${styles.form_data_git_title}`}>
              <h2>Github</h2>
              {!github.isEmpty &&
                github.urlError &&
                errorElem(github.errorText)}
            </div>
            <label className={`${styles.form_data_git_link}`}>
              <p>Вставьте ссылку на Github</p>
              <input
                type="text"
                name="link"
                value={github.value}
                onChange={(e) => github.onChange(e)}
                onBlur={(e) => github.onBlur(e)}
              ></input>
            </label>
          </div>
          <div className={`${styles.form_data_policies}`}>
            <label className={`${styles.form_data_policies_checkbox}`}>
              <input
                type="checkbox"
                checked={checked.value}
                name="policies"
                onChange={(e) => checked.onChange(e)}
                onBlur={(e) => checked.onBlur(e)}
              ></input>{" "}
              * Я согласен с{" "}
              <a href="/" onClick={(e) => togglePoliciesHandler(e)}>
                политикой конфиденциальности
              </a>
            </label>
            {!checked.value &&
              checked.isWrong &&
              errorElem("Подтвердите, что Вы ознакомились")}
          </div>
          <div className={`${styles.form_data_submit}`}>
            <input
              type="submit"
              className={
                buttonStatus
                  ? `${styles.form_data_submit_inactive}`
                  : `${styles.form_data_submit_active}`
              }
              onClick={(e) => toggleAlertHandler(e)}
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}
function PopUp({ type, firstname, onClose, active }) {
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [btnValue, setBtnValue] = useState("");
  const headerHandler = (type, name) => {
    switch (type) {
      case "thanks":
        setHeader(`Спасибо ${name}!`);
        setBody("Мы скоро свяжемся с вами");
        setBtnValue("Понятно");
        break;
      case "policies":
        setHeader("Политика конфиденциальности");
        setBody(`1. Общие положения
        Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Михайловым Иваном Сергеевичем (далее – Оператор).
        1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.
        1.2. Настоящая политика Оператора в отношении обработки персональных данных (далее – Политика) применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта httpsː//thismywebsite·com.
         
        2. Основные понятия, используемые в Политике
        2.1. Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники;
        2.2. Блокирование персональных данных – временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных);
        2.3. Веб-сайт – совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети интернет по сетевому адресу httpsː//thismywebsite·com;
        2.4. Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных, и обеспечивающих их обработку информационных технологий и технических средств;
        2.5. Обезличивание персональных данных — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному Пользователю или иному субъекту персональных данных;
        2.6. Обработка персональных данных – любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных;
        2.7. Оператор – государственный орган, муниципальный орган, юридическое или физическое лицо, самостоятельно или совместно с другими лицами организующие и (или) осуществляющие обработку персональных данных, а также определяющие цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными;
        2.8. Персональные данные – любая информация, относящаяся прямо или косвенно к определенному или определяемому Пользователю веб-сайта httpsː//thismywebsite·com;
        2.9. Пользователь – любой посетитель веб-сайта httpsː//thismywebsite·com;
        2.10. Предоставление персональных данных – действия, направленные на раскрытие персональных данных определенному лицу или определенному кругу лиц;
        2.11. Распространение персональных данных – любые действия, направленные на раскрытие персональных данных неопределенному кругу лиц (передача персональных данных) или на ознакомление с персональными данными неограниченного круга лиц, в том числе обнародование персональных данных в средствах массовой информации, размещение в информационно-телекоммуникационных сетях или предоставление доступа к персональным данным каким-либо иным способом;
        2.12. Трансграничная передача персональных данных – передача персональных данных на территорию иностранного государства органу власти иностранного государства, иностранному физическому или иностранному юридическому лицу;
        2.13. Уничтожение персональных данных – любые действия, в результате которых персональные данные уничтожаются безвозвратно с невозможностью дальнейшего восстановления содержания персональных данных в информационной системе персональных данных и (или) уничтожаются материальные носители персональных данных.
         
        3. Оператор может обрабатывать следующие персональные данные Пользователя
        3.1. Фамилия, имя, отчество;
        3.2. Номер телефона;
        3.3. Адрес электронной почты;
        3.4. Также на сайте происходит сбор и обработка обезличенных данных о посетителях (в т.ч. файлов «cookie») с помощью сервисов интернет-статистики (Яндекс Метрика и Гугл Аналитика и других).
        3.5. Вышеперечисленные данные далее по тексту Политики объединены общим понятием Персональные данные.
         
        4. Цели обработки персональных данных
        4.1. Цель обработки персональных данных Пользователя — заключение, исполнение и прекращение гражданско-правовых договоров; предоставление доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте httpsː//thismywebsite·com; уточнение деталей заказа.
        4.2. Также Оператор имеет право направлять Пользователю уведомления о новых продуктах и услугах, специальных предложениях и различных событиях. Пользователь всегда может отказаться от получения информационных сообщений, направив Оператору письмо на адрес электронной почты privacy@thismywebsite·com с пометкой «Отказ от уведомлений о новых продуктах и услугах и специальных предложениях».
        4.3. Обезличенные данные Пользователей, собираемые с помощью сервисов интернет-статистики, служат для сбора информации о действиях Пользователей на сайте, улучшения качества сайта и его содержания.
         
        5. Правовые основания обработки персональных данных
        5.1. Оператор обрабатывает персональные данные Пользователя только в случае их заполнения и/или отправки Пользователем самостоятельно через специальные формы, расположенные на сайте httpsː//thismywebsite·com. Заполняя соответствующие формы и/или отправляя свои персональные данные Оператору, Пользователь выражает свое согласие с данной Политикой.
        5.2. Оператор обрабатывает обезличенные данные о Пользователе в случае, если это разрешено в настройках браузера Пользователя (включено сохранение файлов «cookie» и использование технологии JavaScript).
         
        6. Порядок сбора, хранения, передачи и других видов обработки персональных данных
        Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.
        6.1. Оператор обеспечивает сохранность персональных данных и принимает все возможные меры, исключающие доступ к персональным данным неуполномоченных лиц.
        6.2. Персональные данные Пользователя никогда, ни при каких условиях не будут переданы третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства.
        6.3. В случае выявления неточностей в персональных данных, Пользователь может актуализировать их самостоятельно, путем направления Оператору уведомление на адрес электронной почты Оператора privacy@thismywebsite·com с пометкой «Актуализация персональных данных».
        6.4. Срок обработки персональных данных является неограниченным. Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору уведомление посредством электронной почты на электронный адрес Оператора privacy@thismywebsite·com с пометкой «Отзыв согласия на обработку персональных данных».
         
        7. Трансграничная передача персональных данных
        7.1. Оператор до начала осуществления трансграничной передачи персональных данных обязан убедиться в том, что иностранным государством, на территорию которого предполагается осуществлять передачу персональных данных, обеспечивается надежная защита прав субъектов персональных данных.
        7.2. Трансграничная передача персональных данных на территории иностранных государств, не отвечающих вышеуказанным требованиям, может осуществляться только в случае наличия согласия в письменной форме субъекта персональных данных на трансграничную передачу его персональных данных и/или исполнения договора, стороной которого является субъект персональных данных.
         
        8. Заключительные положения
        8.1. Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты privacy@thismywebsite·com.
        8.2. В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией.
        8.3. Актуальная версия Политики в свободном доступе расположена в сети Интернет по адресу httpsː//thismywebsite·com/privacy/.`);
        setBtnValue("Я согласен");
    }
  };
  useEffect(() => {
    headerHandler(type, firstname);
  }, [firstname]);

  return (
    <div
      className={`${styles.popup} ${
        active ? styles.popup_active : styles.popup_inactive
      }`}
    >
      <div
        className={`${
          type === "thanks" ? styles.popup_thanks : styles.popup_policies
        }`}
      >
        <svg
          className={`${
            type === "thanks"
              ? styles.popup_thanks_close
              : styles.popup_policies_close
          }`}
          onClick={(e) => onClose(e)}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.21376 8L15.3661 0.666406C15.4692 0.544531 15.3825 0.359375 15.2231 0.359375H13.3528C13.2427 0.359375 13.1372 0.408594 13.0645 0.492969L7.99032 6.54219L2.91611 0.492969C2.84579 0.408594 2.74032 0.359375 2.62782 0.359375H0.757512C0.598137 0.359375 0.511418 0.544531 0.614543 0.666406L6.76689 8L0.614543 15.3336C0.591442 15.3608 0.576622 15.394 0.571842 15.4293C0.567061 15.4647 0.572521 15.5006 0.587574 15.533C0.602627 15.5653 0.626641 15.5926 0.656764 15.6117C0.686886 15.6308 0.721853 15.6408 0.757512 15.6406H2.62782C2.73798 15.6406 2.84345 15.5914 2.91611 15.507L7.99032 9.45781L13.0645 15.507C13.1349 15.5914 13.2403 15.6406 13.3528 15.6406H15.2231C15.3825 15.6406 15.4692 15.4555 15.3661 15.3336L9.21376 8Z"
            fill="#2F80ED"
          />
        </svg>
        <div
          className={`${
            type === "thanks"
              ? styles.popup_thanks_header
              : styles.popup_policies_header
          }`}
        >
          {header}
        </div>
        <div
          className={`${
            type === "thanks"
              ? styles.popup_thanks_body
              : styles.popup_policies_body
          }`}
        >
          {body}
        </div>
        <input
          type="submit"
          className={`${
            type === "thanks"
              ? styles.popup_thanks_btn
              : styles.popup_policies_btn
          }`}
          value={btnValue}
          onClick={(e) => onClose(e, "accept")}
        ></input>
      </div>
      <div className={styles.popup_shadow}></div>
    </div>
  );
}
//! Error ELEMENT
function errorElem(errorText) {
  return <div className={`${styles.error}`}>{errorText}</div>;
}
