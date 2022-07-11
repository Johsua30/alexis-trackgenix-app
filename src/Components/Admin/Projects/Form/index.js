import { joiResolver } from '@hookform/resolvers/joi';
import { ButtonText, ErrorSuccessModal, Input, Textarea } from 'Components/Shared';
import * as Joi from 'joi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getProjectById, updateProject, addProject } from 'redux/projects/thunks';
import styles from './form.module.css';

const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Z][\p{L}\p{M}]*$/u)
    .required()
    .messages({
      'string.min': 'Project name must contain more than 3 letters',
      'string.max': 'Project name must not contain more than 50 letters',
      'string.pattern.base':
        'Project name must contain only letters and start with a capital letter',
      'string.empty': 'Project name is a required field'
    }),
  description: Joi.string()
    .pattern(/(.*[a-zA-Z]){4}/)
    .required()
    .messages({
      'string.pattern.base': 'Description must contain at least 4 letters',
      'string.empty': 'Description is a required field'
    }),
  startDate: Joi.date().min('01-01-1950').max('12-31-2050').required().messages({
    'date.min': 'Only dates from 1950 are accepted',
    'date.max': 'Only dates up to 2050 are accepted',
    'date.base': 'Start date is a required field'
  }),
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .min('01-01-1950')
    .max('12-31-2050')
    .allow('')
    .messages({
      'date.greater': 'End Date must be after the start date',
      'date.min': 'Only dates from 1950 are accepted',
      'date.max': 'Only dates up to 2050 are accepted'
    }),
  clientName: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Z][\p{L}\p{M}]*$/u)
    .required()
    .messages({
      'string.min': 'Client must contain more than 3 letters',
      'string.max': 'Client must not contain more than 50 letters',
      'string.pattern.base': 'Client must contain only letters and and be capitalized',
      'string.empty': 'Client is a required field'
    }),
  active: Joi.boolean().required()
});

const ProjectForm = ({ project, closeModalForm, edit, projectID }) => {
  const [showErrorSuccessModal, setShowErrorSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProjectById(projectID));
  }, []);

  const handleOnSubmit = (data) => {
    if (edit) {
      if (
        data.name === project.name &&
        data.startDate.toString() == new Date(project.startDate) &&
        data.endDate.toString() == new Date(project.endDate) &&
        data.clientName === project.clientName &&
        data.active === project.active &&
        data.description === project.description
      ) {
        setAlertMessage({ message: "There hasn't been any changes", data: {}, error: true });
        setShowErrorSuccessModal(true);
      } else {
        dispatch(
          updateProject(projectID, data, (alertMessage) => setAlertMessage(alertMessage))
        ).then(() => openAlertModal());
      }
    } else {
      dispatch(addProject(data, (message) => setAlertMessage(message))).then(() => {
        setShowErrorSuccessModal(true);
      });
    }
  };

  const closeAlertModal = () => {
    setShowErrorSuccessModal(false);
  };

  const openAlertModal = () => {
    setShowErrorSuccessModal(true);
  };

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: joiResolver(schema),
    defaultValues: {
      name: edit ? project.name : '',
      startDate: edit ? project.startDate.slice(0, 10) : '',
      endDate: edit ? project.endDate.slice(0, 10) : '',
      clientName: edit ? project.clientName : '',
      active: edit ? project.active : true,
      description: edit ? project.description : ''
    },
    shouldFocusError: false
  });

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          label="Project Name"
          type="text"
          name="name"
          placeholder="Insert project name"
          register={register}
          error={errors.name?.message}
        />
        <Input
          label="Client"
          type="text"
          name="clientName"
          placeholder="Insert client name"
          register={register}
          error={errors.clientName?.message}
        />
        <Input
          label="Active"
          name="active"
          type="checkbox"
          register={register}
          error={errors.active?.message}
        />
        <div className={styles.dateContainer}>
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            register={register}
            error={errors.startDate?.message}
          />
          <Input
            label="End Date"
            type="date"
            name="endDate"
            register={register}
            error={errors.endDate?.message}
          />
        </div>
        <Textarea
          label="Description"
          name="description"
          placeholder="Add a description of the project"
          register={register}
          error={errors.description?.message}
        />
      </form>
      <div className={styles.buttonContainer}>
        <ButtonText
          clickAction={handleSubmit(handleOnSubmit)}
          label={edit ? 'Edit' : 'Create'}
        ></ButtonText>
        <ErrorSuccessModal
          show={showErrorSuccessModal}
          closeModal={closeAlertModal}
          closeModalForm={closeModalForm}
          successResponse={alertMessage}
        />
      </div>
    </>
  );
};
export default ProjectForm;
