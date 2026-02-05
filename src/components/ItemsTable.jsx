import { Plus, Trash2 } from 'lucide-react';
import '../styles/quotations.css';

export default function ItemsTable({ items, setItems }) { 

    const agregarFila = () => { 
        const nuevaFila = { 
            id: Date.now() + Math.random(),
            descripcion: '',
            cantidad: 1,
            precio: 0
        };
        setItems([...items, nuevaFila]);    
    };

    const eliminarFila = (id) => { 
        if (items.length > 1) { 
            setItems(items.filter(item => item.id !== id));
        }
    };

    const actualizarItem = (id, campo, valor) => { 
        const nuevosItems = items.map(item => { 
            if (item.id === id) { 
                // CORRECCIÓN: Guardamos el valor tal cual (sin forzar Number inmediatamente)
                return { ...item, [campo]: valor};
            }
            return item;
        });
        setItems(nuevosItems);
    };

    const formatoCLP = (valor) => { 
        if (isNaN(valor)) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
    };

    return ( 
        <div className="tabla-wrapper">
            <div className="items-table-container">
                <table className="items-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50%'}}>Descripción</th>
                            <th className="center" style={{ width: '10%'}}>Cant.</th>
                            <th className="center" style={{ width: '15%'}}>Precio Unit.</th>
                            <th className="right" style={{width: '15%'}}>Total</th>
                            <th style={{ width: '5%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => ( 
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="input-cell"
                                        placeholder="Nombre del producto..."
                                        value={item.descripcion}
                                        onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        className="input-cell number"
                                        value={item.cantidad}
                                        step="any"  /* Permite decimales en el navegador */
                                        // CORRECCIÓN: Pasamos e.target.value directo
                                        onChange={(e) => actualizarItem(item.id, 'cantidad', e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        className="input-cell money"
                                        value={item.precio}
                                        // CORRECCIÓN: Pasamos e.target.value directo
                                        onChange={(e) => actualizarItem(item.id, 'precio', e.target.value)}
                                    />
                                </td>

                                <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#333' }}>
                                    {/* Calculamos el total visualmente convirtiendo a número aquí */}
                                    {formatoCLP((parseFloat(item.cantidad) || 0) * (parseFloat(item.precio) || 0))}
                                </td>

                                <td className="center">
                                    <button
                                        onClick={() => eliminarFila(item.id)}
                                        className="btn-delete"
                                        title="Eliminar línea"
                                    >
                                        <Trash2 size={16} />    
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <button onClick={agregarFila} className="btn-add">
                <Plus size={18} /> Agregar línea
            </button>
        </div>
    );    
}