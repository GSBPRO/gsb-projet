import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { ROLES } from '../auth/roles.js';
import { createUser, updateUser, UserError, validateUser } from './adminUserService.js';
import './AdminPages.css';

const TITLES = ['M.', 'Mme', 'Dr', 'Pr'];

// Formulaire de création (user = null) ou de modification d'un compte (F01, F21).
// À la création, l'administrateur donne un mot de passe provisoire : la personne devra le changer (F04).
export default function UserForm({ user, laboratories, onSaved, onCancel }) {
  const isNew = !user;
  const [values, setValues] = useState({
    email: user?.email ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    title: user?.title ?? '',
    role: user?.role ?? ROLES.professional,
    supplierId: user?.supplierId ?? '',
    profession: user?.profession ?? '',
    temporaryPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSaving) return;

    const found = validateUser(values, { isNew, existingId: user?.id });
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setIsSaving(true);
    try {
      await (isNew ? createUser(values) : updateUser(user.id, values));
      await onSaved();
    } catch (error) {
      if (error instanceof UserError && error.code === 'VALIDATION') setErrors(error.fields);
      else setFormError('Le compte n’a pas pu être enregistré. Réessayez dans un instant.');
      setIsSaving(false);
    }
  }

  return (
    <section className="admin-card" aria-labelledby="user-form-title">
      <h2 id="user-form-title">{isNew ? 'Créer un compte' : `Modifier ${user.firstName} ${user.lastName}`}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <SelectField label="Civilité" name="title" value={values.title} onChange={handleChange} error={errors.title} placeholder="Choisir…">
          {TITLES.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </SelectField>
        <Input label="Prénom" name="firstName" required value={values.firstName} onChange={handleChange} error={errors.firstName} />
        <Input label="Nom" name="lastName" required value={values.lastName} onChange={handleChange} error={errors.lastName} />
        <Input
          label="Email"
          type="email"
          name="email"
          required
          disabled={!isNew}
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <SelectField label="Profil" name="role" value={values.role} onChange={handleChange} error={errors.role}>
          {Object.values(ROLES).map((role) => (
            <option key={role}>{role}</option>
          ))}
        </SelectField>
        {values.role === ROLES.supplier && (
          <SelectField label="Fournisseur" name="supplierId" value={values.supplierId} onChange={handleChange} error={errors.supplierId} placeholder="Choisir…">
            {laboratories.map((laboratory) => (
              <option key={laboratory.id} value={laboratory.id}>
                {laboratory.name}
              </option>
            ))}
          </SelectField>
        )}
        <Input label="Fonction" name="profession" maxLength={80} value={values.profession} onChange={handleChange} />
        {isNew && (
          <Input
            label="Mot de passe provisoire"
            type="text"
            name="temporaryPassword"
            autoComplete="off"
            required
            value={values.temporaryPassword}
            onChange={handleChange}
            error={errors.temporaryPassword}
          />
        )}
        {formError && (
          <p className="admin-error" role="alert">
            {formError}
          </p>
        )}
        <div className="admin-inline">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </section>
  );
}
