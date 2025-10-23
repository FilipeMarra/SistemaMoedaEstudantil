import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './cadastroAluno.css';

const CadastroAlunoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados do Contratante
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    // Endereço do Contratante
    logradouro_contratante: '',
    bairro_contratante: '',
    numero_contratante: '',
    cidade_contratante: '',
    uf_contratante: '',
    complemento_contratante: '',
    cep_contratante: '',
    // Dados do Acervo
    nome_proprietario: '',
    nome_colecao: '',
    categoria_acervo: '',
    tipo_acervo: '',
    quantidade_obras: '',
    local_catalogacao: '',
    produto_entregue: '',
    responsavel_acompanhamento: '',
    responsavel_acesso: '',
    prazo_execucao: '',
    observacao: '',
    // Endereço do Acervo
    logradouro_acervo: '',
    bairro_acervo: '',
    numero_acervo: '',
    cidade_acervo: '',
    uf_acervo: '',
    complemento_acervo: '',
    cep_acervo: ''
  });

  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Se tiver imagem, envie multipart/form-data
      let response;
      // determine public visibility from tipo_acervo
      const isPublic = (formData.tipo_acervo || '').toLowerCase() === 'público';

      if (imageFile) {
        const fd = new FormData();
        Object.keys(formData).forEach((k) => {
          if (formData[k] !== undefined && formData[k] !== null) fd.append(k, formData[k]);
        });
        fd.append('publico', isPublic);
        fd.append('imagem', imageFile);

        response = await fetch('http://localhost:8000/api/acervos/', {
          method: 'POST',
          body: fd,
        });
      } else {
        const body = { ...formData, publico: isPublic };
        // não envie campo 'imagem' como string em JSON — DRF espera um arquivo
        if (body.imagem !== undefined) delete body.imagem;
        response = await fetch('http://localhost:8000/api/acervos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Acervo cadastrado com sucesso!' });
        // Mostrar modal de sucesso
        showSuccessModal();
      } else {
        const errorData = await response.json();
        console.error('Erro ao cadastrar acervo:', errorData);
        setMessage({ 
          type: 'error', 
          text: errorData.detail || 'Erro ao cadastrar acervo. Verifique os dados e tente novamente.' 
        });
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor. Verifique se o backend está rodando.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessModal = () => {
    // Usando SweetAlert2 via CDN (adicione o script no index.html)
    // Se o Sweetalert2 estiver disponível
    if (window.Swal) {
      window.Swal.fire({
        title: "Acervo cadastrado com sucesso!",
        text: "Deseja cadastrar mais um?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
      }).then((result) => {
        if (!result.isConfirmed) {
          navigate('/listagem');
        } else {
          // Limpar formulário para novo cadastro
          setFormData({
            nome: '',
            cnpj: '',
            telefone: '',
            email: '',
            logradouro_contratante: '',
            bairro_contratante: '',
            numero_contratante: '',
            cidade_contratante: '',
            uf_contratante: '',
            complemento_contratante: '',
            cep_contratante: '',
            nome_proprietario: '',
            nome_colecao: '',
            categoria_acervo: '',
            tipo_acervo: '',
            quantidade_obras: '',
            local_catalogacao: '',
            produto_entregue: '',
            responsavel_acompanhamento: '',
            responsavel_acesso: '',
            prazo_execucao: '',
            observacao: '',
            logradouro_acervo: '',
            bairro_acervo: '',
            numero_acervo: '',
            cidade_acervo: '',
            uf_acervo: '',
            complemento_acervo: '',
            cep_acervo: ''
          });
          setImageFile(null);
          setImagePreview(null);
          setMessage(null);
        }
      });
    } else {
      alert("Acervo cadastrado com sucesso!");
      navigate('/listagem');
    }
  };

  return (
    <>
      <Header />
      <main className="container my-5 bg-dark" style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <div className="card bg-secondary bg-opacity-10 shadow rounded">
          <div className="card-header bg-black bg-opacity-50 shadow rounded text-white text-center py-3">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Cadastrar Acervo</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-4 shadow bg-secondary bg-opacity-10">
            {/* Dados do Contratante */}
            <div className="bg-black bg-opacity-50 p-2 mb-3 text-white text-center rounded" style={{ marginBottom: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold' }}>Dados do Contratante</h4>
            </div>
            <div className="row mb-3">
              <div className="mt-3">
                <label className="form-label text-white">
                  <i className="bi bi-person-fill me-2"></i><b>Nome</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white">
                  <i className="bi bi-card-text me-2"></i><b>CNPJ / CPF</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="Digite o CNPJ ou CPF"
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white">
                  <i className="bi bi-telephone-fill me-2"></i><b>Telefone</b>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(XX) XXXXX-XXXX"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white">
                  <i className="bi bi-envelope-fill me-2"></i><b>E-mail</b>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
            </div>

            {/* Endereço do Contratante */}
            <div className="bg-black bg-opacity-50 p-2 mb-3 text-white text-center rounded" style={{ marginBottom: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold' }}>Endereço do Contratante</h4>
            </div>
            <div className="row mb-3">
              <div className="mt-3">
                <label className="form-label text-white"><b>Logradouro</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="logradouro_contratante"
                  value={formData.logradouro_contratante}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Bairro</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="bairro_contratante"
                  value={formData.bairro_contratante}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Número</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="numero_contratante"
                  value={formData.numero_contratante}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Cidade</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="cidade_contratante"
                  value={formData.cidade_contratante}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Unidade Federativa</b></label>
                <select
                  className="form-select"
                  name="uf_contratante"
                  value={formData.uf_contratante}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Complemento</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="complemento_contratante"
                  value={formData.complemento_contratante}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>CEP</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="cep_contratante"
                  value={formData.cep_contratante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Dados do Acervo */}
            <div className="bg-black bg-opacity-50 p-2 mb-3 text-white text-center rounded" style={{ marginBottom: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold' }}>Dados do Acervo</h4>
            </div>
            <div className="row mb-3">
              <div className="mt-3">
                <label className="form-label text-white"><b>Nome do Proprietário</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="nome_proprietario"
                  value={formData.nome_proprietario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Nome da Coleção</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="nome_colecao"
                  value={formData.nome_colecao}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Imagem do acervo (opcional) */}
              <div className="mt-3">
                <label className="form-label text-white"><b>Foto do Acervo (opcional)</b></label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={imagePreview} alt="preview" style={{ maxWidth: '220px', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,.3)' }} />
                    <div>
                      <button type="button" className="btn btn-sm btn-link text-white" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                        Remover foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Escolha a Categoria do Acervo</b></label>
                <select
                  className="form-select"
                  name="categoria_acervo"
                  value={formData.categoria_acervo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione a categoria</option>
                  <option value="Museológico">Museológico</option>
                  <option value="Bibliográfico">Bibliográfico</option>
                  <option value="Arquivístico">Arquivístico</option>
                  <option value="Artístico">Artístico</option>
                  <option value="Histórico">Histórico</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Escolha o Tipo de Acervo</b></label>
                <select
                  className="form-select"
                  name="tipo_acervo"
                  value={formData.tipo_acervo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Quantidade de Obras</b></label>
                <input
                  type="number"
                  className="form-control"
                  name="quantidade_obras"
                  value={formData.quantidade_obras}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Local de Catalogação</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="local_catalogacao"
                  value={formData.local_catalogacao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Produto a ser entregue</b></label>
                <textarea
                  className="form-control"
                  name="produto_entregue"
                  value={formData.produto_entregue}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Responsável acompanhamento</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="responsavel_acompanhamento"
                  value={formData.responsavel_acompanhamento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Responsável acervo e acesso ao local</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="responsavel_acesso"
                  value={formData.responsavel_acesso}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Prazo Execução</b></label>
                <input
                  type="date"
                  className="form-control"
                  name="prazo_execucao"
                  value={formData.prazo_execucao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label text-white"><b>Observação</b></label>
                <textarea
                  className="form-control"
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Endereço do Acervo */}
            <div className="bg-black bg-opacity-50 p-2 mb-3 text-white text-center rounded" style={{ marginBottom: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold' }}>Endereço do Acervo</h4>
            </div>
            <div className="row mb-3">
              <div className="mt-3">
                <label className="form-label text-white"><b>Logradouro</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="logradouro_acervo"
                  value={formData.logradouro_acervo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Bairro</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="bairro_acervo"
                  value={formData.bairro_acervo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Número</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="numero_acervo"
                  value={formData.numero_acervo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Cidade</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="cidade_acervo"
                  value={formData.cidade_acervo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Unidade Federativa</b></label>
                <select
                  className="form-select"
                  name="uf_acervo"
                  value={formData.uf_acervo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>Complemento</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="complemento_acervo"
                  value={formData.complemento_acervo}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label className="form-label text-white"><b>CEP</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="cep_acervo"
                  value={formData.cep_acervo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="row mb-4 mt-4">
              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg"
                  disabled={isSubmitting}
                  style={{ 
                    width: '150px',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 'bold',
                    marginRight: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {isSubmitting ? 
                    <><i className="bi bi-hourglass-split me-2"></i>Salvando...</> : 
                    <><i className="bi bi-check-circle me-2"></i>Salvar</>
                  }
                </button>
                <a 
                  href="#" 
                  onClick={() => navigate('/listagem')} 
                  style={{ 
                    width: '150px',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                  className="btn btn-secondary btn-lg"
                >
                  <i className="bi bi-x-circle me-2"></i>Cancelar
                </a>
              </div>
            </div>
            
            {/* Mensagem de erro */}
            {message && message.type === 'error' && (
              <div className="alert alert-danger mt-3" role="alert">
                {message.text}
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CadastroAlunoPage;