function status(request, response) {
  response.status(200).json({ chave: "Seguimos" });
}

export default status;
