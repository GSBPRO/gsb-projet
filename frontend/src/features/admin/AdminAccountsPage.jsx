import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import useLoader from '../../utils/useLoader.js';
import { ROLES } from '../auth/roles.js';
import useAuth from '../auth/useAuth.js';
import { listUsers, setUserActive } from './adminUserService.js';
import UserForm from './UserForm.jsx';
import './AdminPages.css';

// Gestion des comptes (F01, F21) : création, modification, activation et désactivation.
// Il n'y a pas d'inscription sur le site : seul l'administrateur crée des comptes (F02).
export default function AdminAccountsPage() {
  const { user: currentAdmin } = useAuth();
  const { status, data, reload } = useLoader(listUsers);
  // editing : null (rien), 'new' (création) ou le compte en cours de modification.
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  async function handleToggle(user) {
    setMessage('');
    try {
      await setUserActive(user.id, !user.active, currentAdmin.id);
      await reload();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSaved() {
    setEditing(null);
    await reload();
  }

  const laboratoryName = (id) => data.laboratories.find((laboratory) => laboratory.id === id)?.name;

  return (
    <div>
      <PageHeader title="Comptes" subtitle="Les professionnels, fournisseurs et administrateurs.">
        {!editing && <Button onClick={() => setEditing('new')}>Créer un compte</Button>}
      </PageHeader>

      {editing && data && (
        <UserForm
          key={editing === 'new' ? 'new' : editing.id}
          user={editing === 'new' ? null : editing}
          laboratories={data.laboratories}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      {message && (
        <p className="admin-error" role="alert">
          {message}
        </p>
      )}

      <PageState status={status} isEmpty={status === 'success' && data.users.length === 0} emptyText="Aucun compte." onRetry={reload}>
        {data && (
          <DataTable caption="Comptes utilisateurs">
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Email</th>
                <th scope="col">Profil</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>
                      {user.title} {user.firstName} {user.lastName}
                    </strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.role}
                    {user.role === ROLES.supplier && <span className="muted"> · {laboratoryName(user.supplierId)}</span>}
                  </td>
                  <td>
                    <StatusBadge tone={user.active ? 'success' : 'neutral'}>{user.active ? 'Actif' : 'Désactivé'}</StatusBadge>
                    {user.mustChangePassword && <StatusBadge tone="pending">Mot de passe provisoire</StatusBadge>}
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <Button variant="secondary" className="btn--small" onClick={() => setEditing(user)}>
                        Modifier<span className="visually-hidden"> {user.firstName} {user.lastName}</span>
                      </Button>
                      {user.id !== currentAdmin.id && (
                        <Button variant={user.active ? 'danger' : 'secondary'} className="btn--small" onClick={() => handleToggle(user)}>
                          {user.active ? 'Désactiver' : 'Activer'}
                          <span className="visually-hidden"> {user.firstName} {user.lastName}</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </PageState>
    </div>
  );
}
