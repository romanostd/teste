using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationsController : ControllerBase
    {
        Configuration configuration;
        public ConfigurationsController(Configuration configuration) { 
            this.configuration = configuration;
        }

        [HttpGet]
        public Dictionary<string, string?> Get()
        {
            return configuration.GetAll();
        }
    }
}
