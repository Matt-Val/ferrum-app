import { Plus, Trash2 } from 'lucide-react';
import '../styles/quotations.css';


export default function ItemsTable({ items, setItems }) { 

    const agregarFila = () => { 
        const nuevaFila = { 
            id: crypto.randomUUID(),
            description: '',
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
                return { ...item, [campo]: valor};
            }
            return item;
        });
        setItems(nuevosItems);
    };


    
}