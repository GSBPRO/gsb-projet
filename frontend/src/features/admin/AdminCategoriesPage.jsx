import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import useLoader from '../../utils/useLoader.js';
import { createCategory, listCategories, renameCategory, setCategoryActive } from './adminCatalogueService.js';
import './AdminPages.css';

// Gestion des catégories : ajout, renommage, activation / désactivation (F22).
// Désactiver une catégorie la retire du catalogue avec ses produits, sans rien supprimer.
export default function AdminCategoriesPage() {
  const { status, data: categories, reload } = useLoader(listCategories);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState({ id: null, name: '' });
  const [message, setMessage] = useState('');

  async function run(action) {
    setMessage('');
    try {
      await action();
      await reload();
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (await run(() => createCategory(newName))) setNewName('');
  }

  async function handleRename(event) {
    event.preventDefault();
    if (await run(() => renameCategory(editing.id, editing.name))) setEditing({ id: null, name: '' });
  }

  return (
    <div>
      <PageHeader title="Catégories" subtitle="Les rayons du catalogue." />

      <section className="admin-card" aria-labelledby="new-category-title">
        <h2 id="new-category-title">Ajouter une catégorie</h2>
        <form onSubmit={handleCreate} noValidate>
          <Input label="Nom de la catégorie" name="name" required maxLength={60} value={newName} onChange={(event) => setNewName(event.target.value)} />
          <Button type="submit">Ajouter</Button>
        </form>
      </section>

      {message && (
        <p className="admin-error" role="alert">
          {message}
        </p>
      )}

      <PageState status={status} isEmpty={status === 'success' && categories.length === 0} emptyText="Aucune catégorie." onRetry={reload}>
        {categories && (
          <DataTable caption="Catégories">
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {editing.id === category.id ? (
                      <form className="admin-inline" onSubmit={handleRename}>
                        <input
                          aria-label={`Nouveau nom de ${category.name}`}
                          value={editing.name}
                          maxLength={60}
                          onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                        />
                        <Button type="submit" className="btn--small">
                          Enregistrer
                        </Button>
                        <Button variant="secondary" className="btn--small" onClick={() => setEditing({ id: null, name: '' })}>
                          Annuler
                        </Button>
                      </form>
                    ) : (
                      <strong>{category.name}</strong>
                    )}
                  </td>
                  <td>
                    <StatusBadge tone={category.active === false ? 'neutral' : 'success'}>{category.active === false ? 'Désactivée' : 'Active'}</StatusBadge>
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <Button variant="secondary" className="btn--small" onClick={() => setEditing({ id: category.id, name: category.name })}>
                        Renommer<span className="visually-hidden"> {category.name}</span>
                      </Button>
                      <Button variant="secondary" className="btn--small" onClick={() => run(() => setCategoryActive(category.id, category.active === false))}>
                        {category.active === false ? 'Activer' : 'Désactiver'}
                        <span className="visually-hidden"> {category.name}</span>
                      </Button>
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
