import { useState, useEffect } from 'react';
    import { supabase } from '../utils/supabaseClient';

    export default function UserProfile() {
      const [npwp, setNpwp] = useState('');
      const [contracts, setContracts] = useState([]);
      const [invoices, setInvoices] = useState([]);

      useEffect(() => {
        const fetchContracts = async () => {
          const { data, error } = await supabase.storage.from('contracts').list();
          if (error) console.error('Error fetching contracts:', error.message);
          else setContracts(data);
        };

        const fetchInvoices = async () => {
          const { data, error } = await supabase.from('invoices').select('*');
          if (error) console.error('Error fetching invoices:', error.message);
          else setInvoices(data);
        };

        fetchContracts();
        fetchInvoices();
      }, []);

      const handleNpwpUpdate = async () => {
        const { error } = await supabase.from('users').update({ npwp }).eq('id', supabase.auth.user().id);
        if (error) console.error('Error updating NPWP:', error.message);
      };

      const handleContractUpload = async (event) => {
        const file = event.target.files[0];
        const { error } = await supabase.storage.from('contracts').upload(`contracts/${file.name}`, file);
        if (error) console.error('Error uploading contract:', error.message);
      };

      return (
        <div className="p-4">
          <h1 className="header">User Profile</h1>
          <div className="card">
            <input
              type="text"
              placeholder="NPWP"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              className="input"
            />
            <button onClick={handleNpwpUpdate} className="button">
              Update NPWP
            </button>
          </div>

          <div className="card">
            <input type="file" onChange={handleContractUpload} className="input" />
            <h2 className="subheader">Contracts</h2>
            <ul>
              {contracts.map(contract => (
                <li key={contract.id}>
                  <a href={contract.url} download className="text-blue-500">{contract.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="subheader">Invoices</h2>
            <ul>
              {invoices.map(invoice => (
                <li key={invoice.id}>
                  {invoice.billing_period} - {invoice.total_salary}
                  <a href={invoice.pdf_url} download className="text-blue-500 ml-2">Download</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
